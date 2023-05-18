
// libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

// UI components
import Header from '../components/UI/Header';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import LoadingIndicator from '../components/UI/LoadingIndicator';

// actions
import { createOrder, updateOrder, getOrders } from '../actions/orders';
import { getPlans } from '../actions/plans';
import { updateUser } from '../actions/user';
import { createSubscription } from '../actions/subscriptions';
import { updateBed } from '../actions/beds';
import { createPlantActivity, getPlantActivities } from '../actions/plantActivities';
import { getReportType } from '../actions/reportTypes/index';
import { createReport } from '../actions/reports/index';
import { createAnswer, setAnswers } from '../actions/answers/index';
import { createReminder, getReminders } from '../actions/reminders/index';
import { createMessage } from '../actions/messages/index';
import { createConversation, getConversations } from '../actions/conversations/index';

// helpers
import uploadImage from '../helpers/uploadImage';
import vars from '../vars/index';

// types
import types from '../vars/types';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class ImageUpload extends Component {

    state = {
        selectedImages: [],
        plantReplacements: []
    }

    async componentDidMount() {
        if (this.props.route.params.order.type === types.INITIAL_PLANTING) {

            // get plans
            this.props.getPlans();
        } else if (this.props.route.params.order.type === types.FULL_PLAN || this.props.route.params.order.type === types.ASSISTED_PLAN) {

            // get plant activities
            await this.props.getPlantActivities(`order=${this.props.route.params.order._id}`);

            const plantsToBeReplaced = this.props.plantActivities.filter((plantActivity) => plantActivity.type === types.DECEASED || (plantActivity.type === types.HARVESTED && plantActivity.harvest === 'full'));
            let plantReplacements = [];

            // group plant replacements by common type and plant type
            plantsToBeReplaced.forEach((plantToBeReplaced) => {
                const matchIndex = plantReplacements.findIndex((replacement) => (replacement.plant.common_type._id === plantToBeReplaced.plant.common_type._id) && (replacement.plant._id === plantToBeReplaced.plant._id));
                if (matchIndex > 0) {
                    plantReplacements[matchIndex] = {
                        qty: plantReplacements[matchIndex].qty + 1,
                        plant: plantReplacements[matchIndex].plant
                    }
                } else {
                    plantReplacements.push({
                        qty: 1,
                        plant: plantToBeReplaced.plant
                    })
                }
            })

            // update UI
            this.setState({
                plantReplacements
            })
        }
    }

    getHelperText(order) {
        switch (order.type) {
            case types.INITIAL_PLANTING:
                return 'Upload a minimum of 2 photos: 1 before the planting, and 1 after the planting. Submit additional photos as needed.';
            case types.FULL_PLAN:
                return 'Upload a minimum of 2 photos. If there was a harvest, make sure to upload photos of the harvested plants.';
            case types.ASSISTED_PLAN:
                return 'Upload a minimum of 2 photos. If there was a harvest, make sure to upload photos of the harvested plants.';
            default:
                return 'Upload a minimum of 2 photos. Submit additional photos as needed.';
        }
    }

    async selectImages() {

        // open image gallery
        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 10,
                maxWidth: 500,
                maxHeight: 500,
                quality: 1,
            },
            res => {
                // if user selected an image {...}
                if (!res.didCancel) {
                    const imgWithNoDimensions = res.assets?.find((img) => img.width === 0 || img.height === 0);

                    // if image has no dimensions {...}
                    if (imgWithNoDimensions) {

                        // show warning to user
                        return alert(`Your file "${imgWithNoDimensions.fileName}" has no dimensions, please select another image and try again.`);
                    } else {

                        // upload images
                        this.finish(res);
                    }
                }
            },
        );
    }

    async finish(res) {

        // show loading indicator
        this.setState({ isLoading: true });

        let uploadImages = [];
        res.assets.forEach((asset) => {
            uploadImages.push(new Promise(async (resolve) => {

                // upload image to S3
                const selectedImage = await uploadImage(
                    asset.uri,
                    'order.jpg',
                    'jpg',
                );

                resolve({
                    filename: asset.fileName,
                    mimetype: asset.type,
                    size: asset.fileSize,
                    url: selectedImage
                });
            }))
        })

        Promise.all(uploadImages).then((selectedImages) => {

            // update UI
            this.setState({
                selectedImages,
                isLoading: false
            });
        })
    }

    async submit() {

        // close out order in system
        await this.closeOrder();

        // process order results and next steps
        switch (this.props.route.params.order.type) {
            case types.INITIAL_PLANTING:
                return this.processInitialPlanting();
            case types.CROP_ROTATION:
                return this.processCropRotation();
            case types.FULL_PLAN:
                return this.processMaintenance();
            case types.ASSISTED_PLAN:
                return this.processMaintenance();
            default:
                return;
        }

    }

    async closeOrder() {
        const order = this.props.route.params.order;
        const updatedOrder = {
            images: this.state.selectedImages,
            status: 'complete',
            dt_completed: new Date()
        }

        // update order with results
        await this.props.updateOrder(order._id, updatedOrder);
    }

    async processInitialPlanting() {

        // show loading indicator
        this.setState({ isLoading: true });

        // get beds associated to initial planting order
        let beds = this.props.beds.filter(item => {
            return this.props.drafts.some(ele => ele.key === item.key);
        });

        const order = this.props.selectedOrder;
        let updateBeds = [];
        let createPlantActivities = [];

        beds.forEach((bed) => {
            bed.plot_points.forEach((row) => {
                row.forEach((column) => {
                    if (column.plant) {

                        // check if column has image, as to only create a single plant activity
                        if (column.image) {

                            // add new plant activity to list
                            createPlantActivities.push(
                                new Promise(async resolve => {

                                    // create plant activity
                                    await this.props.createPlantActivity({
                                        type: types.PLANTED,
                                        owner: this.props.user._id,
                                        customer: order.customer._id,
                                        order: order._id,
                                        plant: column.plant.id._id,
                                        key: column.plant.key,
                                        bed: bed._id
                                    });
                                    resolve();
                                }))
                        }
                    }
                })
            })

            updateBeds.push(
                new Promise(async resolve => {

                    // update bed (date planted)
                    await this.props.updateBed(bed._id, { plot_points: bed.plot_points });
                    resolve();
                }),
            );
        })

        // get report type
        const reportType = await this.props.getReportType(`name=${order.type}`);

        // create report
        const report = await this.props.createReport({
            type: reportType._id,
            order: order._id,
            customer: order.customer._id,
        })

        let createAnswers = [];
        this.props.answers.forEach((data) => {
            createAnswers.push(new Promise(async (resolve) => {

                // create answer
                await this.props.createAnswer({
                    report: report._id,
                    question: data.question,
                    result: data.result
                })
                resolve();
            }))
        })

        // create answers
        await Promise.all(createAnswers);

        // update beds
        Promise.all(updateBeds).then(async () => {

            // create plant activities
            Promise.all(createPlantActivities).then(async () => {

                let maintenancePlan = order.customer.garden_info.maintenance_plan;

                // if customer selected a maintenance plan and it has not been activated yet {...}
                if ((maintenancePlan !== 'none') && (!order.customer.payment_info.plan_id)) {

                    // NOTE: This check is necessary because for the new mobile schema we use plan id's instead of name strings - change when mobile app development is done
                    if (maintenancePlan !== types.FULL_PLAN && maintenancePlan !== types.ASSISTED_PLAN) {

                        // get maintance plan
                        const plan = this.props.plans.find((plan) => plan._id === maintenancePlan);

                        // set maintance plan
                        maintenancePlan = plan.type;
                    }

                    const orderDescription = (maintenancePlan === types.FULL_PLAN) ? vars.orderDescriptions.customer.fullPlan : vars.orderDescriptions.customer.assistedPlan;

                    const maintenanceOrder = {
                        type: maintenancePlan,
                        date: moment().add(1, 'week').startOf('day'),
                        customer: order.customer._id,
                        description: orderDescription,
                        vendor: this.props.user._id
                    }

                    // create new order
                    await this.props.createOrder(maintenanceOrder);

                    const newSubscription = {
                        customerId: order.customer.payment_info.customer_id,
                        userId: order.customer._id,
                        selectedPlan: maintenancePlan
                    }

                    // create new subscription
                    const subscription = await this.props.createSubscription(newSubscription);

                    const paymentInfo = {
                        name: order.customer.payment_info.name,
                        token: order.customer.payment_info.token,
                        card_id: order.customer.payment_info.card_id,
                        card_brand: order.customer.payment_info.card_brand,
                        card_last4: order.customer.payment_info.card_last4,
                        card_exp_month: order.customer.payment_info.card_exp_month,
                        card_exp_year: order.customer.payment_info.card_exp_year,
                        customer_id: order.customer.payment_info.customer_id,
                        plan_id: subscription.id
                    }

                    // update user payment info with new plan id
                    await this.props.updateUser(`userId=${order.customer._id}`, { paymentInfo }, true);

                    // get pending orders
                    await this.props.getOrders(
                        `status=pending&vendor=${this.props.user._id}`,
                    );

                    // reset answers
                    await this.props.setAnswers([]);

                    // hide loading indicator
                    this.setState({ isLoading: false });

                    // redirect user to success page
                    this.props.navigation.navigate('Order Complete', { orderType: order.type });
                } else {
                    // get pending orders
                    await this.props.getOrders(
                        `status=pending&vendor=${this.props.user._id}`,
                    );

                    // reset answers
                    await this.props.setAnswers([]);

                    // hide loading indicator
                    this.setState({ isLoading: false });

                    // redirect user to success page
                    this.props.navigation.navigate('Order Complete', { orderType: order.type });
                }
            });
        });
    }

    async processCropRotation() {

        // show loading indicator
        this.setState({ isLoading: true });

        let beds = this.props.beds;
        const order = this.props.selectedOrder;
        let updateBeds = [];
        let createPlantActivities = [];

        // iterate through beds
        beds.forEach((bed) => {
            bed.plot_points.forEach((row) => {
                row.forEach((column) => {
                    if (column.plant) {

                        // check if column has image, as to only create a single plant activity
                        if (column.image) {

                            // add new plant activity to list
                            createPlantActivities.push(
                                new Promise(async resolve => {

                                    // create plant activity
                                    await this.props.createPlantActivity({
                                        type: types.PLANTED,
                                        owner: this.props.user._id,
                                        customer: order.customer._id,
                                        order: order._id,
                                        plant: column.plant.id._id,
                                        key: column.plant.key,
                                        bed: bed._id
                                    });
                                    resolve();
                                }))
                        }
                    }
                })
            })

            updateBeds.push(
                new Promise(async resolve => {

                    // update bed
                    await this.props.updateBed(bed._id, { plot_points: bed.plot_points });
                    resolve();
                }),
            );
        })

        // get report type
        const reportType = await this.props.getReportType(`name=${order.type}`);

        // create report
        const report = await this.props.createReport({
            type: reportType._id,
            order: order._id,
            customer: order.customer._id,
        })

        let createAnswers = [];
        this.props.answers.forEach((data) => {
            createAnswers.push(new Promise(async (resolve) => {

                // create answer
                await this.props.createAnswer({
                    report: report._id,
                    question: data.question,
                    result: data.result
                })
                resolve();
            }))
        })

        // create answers
        await Promise.all(createAnswers);

        // update beds
        Promise.all(updateBeds).then(async () => {

            // create plant activities
            Promise.all(createPlantActivities).then(async () => {

                // get pending orders
                await this.props.getOrders(
                    `status=pending&vendor=${this.props.user._id}`,
                );

                // check for a pending maintenance order
                const maintanceOrder = this.props.orders.list.find((o) => (o.customer._id === order.customer._id) && (o.type === types.FULL_PLAN || o.type === types.ASSISTED_PLAN));

                // if maintenance order found {...}
                if (maintanceOrder) {

                    // set new date for 1 week from today
                    const orderDate = moment().add(8, 'days').startOf('day');

                    // update order date
                    await this.props.updateOrder(maintanceOrder._id, { date: orderDate });

                    // get pending orders
                    await this.props.getOrders(
                        `status=pending&vendor=${this.props.user._id}`,
                    );
                }

                // reset answers
                await this.props.setAnswers([]);

                // hide loading indicator
                this.setState({ isLoading: false });

                // redirect user to success page
                this.props.navigation.navigate('Order Complete', { orderType: types.CROP_ROTATION });
            });
        });
    }

    async processMaintenance() {

        // show loading indicator
        this.setState({ isLoading: true });

        const order = this.props.selectedOrder;

        // get report type
        const reportType = await this.props.getReportType(`name=${order.type}`);

        // create report
        const report = await this.props.createReport({
            type: reportType._id,
            order: order._id,
            customer: order.customer._id,
        })

        let createAnswers = [];
        this.props.answers.forEach((data) => {
            createAnswers.push(new Promise(async (resolve) => {

                // create answer
                await this.props.createAnswer({
                    report: report._id,
                    question: data.question,
                    result: data.result
                })
                resolve();
            }))
        })

        // create answers
        Promise.all(createAnswers).then(async () => {
            const orderDate = (order.type === types.FULL_PLAN) ? moment(order.date).add(1, 'week').startOf('day') : moment(order.date).add(2, 'weeks').startOf('day');
            const orderDescription = (order.type === types.FULL_PLAN) ? vars.orderDescriptions.customer.fullPlan : vars.orderDescriptions.customer.assistedPlan;
            const nextOrder = {
                type: order.type,
                date: orderDate,
                customer: order.customer._id,
                vendor: order.vendor._id,
                description: orderDescription
            }

            // create next order
            await this.props.createOrder(nextOrder);

            const plantReplacements = this.state.plantReplacements;
            if (plantReplacements.length > 0) {
                let reminderDescription = '';
                plantReplacements.forEach((replacement, index) => {
                    reminderDescription += `(${replacement.qty}) ${replacement.plant.name} ${replacement.plant.common_type.name}`;
                    if (index !== (plantReplacements.length - 1)) {
                        reminderDescription += ', ';
                    }
                })

                const reminder = {
                    title: `Pick up plants - ${order.customer.address}`,
                    description: reminderDescription,
                    time: '07',
                    date: orderDate,
                    owner: this.props.user._id,
                    customer: order.customer._id
                };

                // create new reminder
                await this.props.createReminder(reminder);
            }

            // find answer with note to customer
            const questionIndex = this.props.questions.findIndex((question) => question.placement === 6);
            const question = this.props.questions[questionIndex];
            const answerIndex = this.props.answers.findIndex((answer) => answer.question === question._id);
            const answer = this.props.answers[answerIndex];

            // format message
            let message = {
                sender: this.props.user._id,
                receiver: order.customer._id,
                text: answer.result.note,
                attachments: this.state.selectedImages
            }

            // look for current conversation between vendor and customer
            const conversations = await this.props.getConversations(`users=${order.customer._id},${this.props.user._id}`, true);

            // if a conversation already exists {...}
            if (conversations.length > 0) {

                // set conversation id
                message.conversation_id = conversations[0]._id;

                // create new message
                await this.props.createMessage(message);
            } else {
                // format conversation
                const conversation = { users: [order.customer._id, this.props.user._id] };

                // create new conversation
                const newConversation = await this.props.createConversation(conversation);

                // set conversation id
                message.conversation_id = newConversation._id;

                // create new message
                await this.props.createMessage(message);
            }

            // get updated orders
            await this.props.getOrders(`status=pending&vendor=${this.props.user._id}`);

            // get new reminders
            await this.props.getReminders(`status=pending&page=1&limit=50`);
            
            // reset answers
            await this.props.setAnswers([]);

            // redirect user to success page
            this.props.navigation.navigate('Order Complete', { orderType: order.type });

            // hide loading indicator
            this.setState({ isLoading: false });
        })
    }

    render() {
        const {
            isLoading,
            selectedImages
        } = this.state;
        const order = this.props.route.params.order;
        const helperText = this.getHelperText(order);

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* loading indicator (dynamically visible) */}
                        <LoadingIndicator loading={isLoading} />

                        {/* header */}
                        <Header type="h4" style={{ marginBottom: units.unit3 }}>
                            Image Upload
                        </Header>

                        {/* helper text */}
                        <Text style={{ marginBottom: units.unit4 }}>{helperText}</Text>

                        {/* image input */}
                        <TouchableOpacity onPress={() => this.selectImages()}>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    borderStyle: 'dashed',
                                    borderColor: colors.purpleB,
                                    borderWidth: 1,
                                    borderRadius: 1
                                }}>
                                <View style={{ padding: units.unit6, display: 'flex', alignItems: 'center' }}>
                                    <Ionicons
                                        name="cloud-upload-outline"
                                        size={fonts.h1}
                                        color={colors.purpleB}
                                    />
                                    <Paragraph>Tap here to upload</Paragraph>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* image list */}
                        {selectedImages.map((image, index) => (
                            <View key={index} style={{ marginTop: units.unit4 }}>
                                <Image
                                    source={{
                                        uri: image.url,
                                    }}
                                    style={{
                                        width: '100%',
                                        height: units.unit8,
                                    }}
                                />
                            </View>
                        ))}

                        {/* submission button */}
                        <Button
                            disabled={selectedImages.length < 1}
                            style={{
                                display: 'flex',
                                marginTop: units.unit4,
                            }}
                            text="Submit"
                            onPress={() => this.submit()}
                            icon={
                                <Ionicons
                                    name="checkmark"
                                    size={units.unit4}
                                    color={colors.purpleB}
                                />
                            }
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        plans: state.plans,
        beds: state.beds,
        drafts: state.drafts,
        orders: state.orders,
        answers: state.answers,
        questions: state.questions,
        plantActivities: state.plantActivities,
        selectedOrder: state.selectedOrder
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            createOrder,
            updateOrder,
            getOrders,
            getPlans,
            updateUser,
            createSubscription,
            updateBed,
            createPlantActivity,
            getReportType,
            createReport,
            createAnswer,
            createReminder,
            getPlantActivities,
            getReminders,
            createMessage,
            getConversations,
            createConversation,
            setAnswers
        },
        dispatch,
    );
}

ImageUpload = connect(mapStateToProps, mapDispatchToProps)(ImageUpload);

export default ImageUpload;

module.exports = ImageUpload;