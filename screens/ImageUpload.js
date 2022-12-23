
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

// helpers
import uploadImage from '../helpers/uploadImage';
import vars from '../vars/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class ImageUpload extends Component {

    state = {
        selectedImages: []
    }

    componentDidMount() {
        if (this.props.route.params.order.type === 'initial planting') {
            this.props.getPlans();
        }
    }

    getHelperText(order) {
        switch (order.type) {
            case 'initial planting':
                return 'Upload a minimum of 2 pictures: 1 before the planting, and 1 after the planting. Submit additional images as needed.';
            default:
                return 'Upload a minimum of 2 pictures: 1 before the service, and 1 after the service';
        }
    }

    async selectImages() {
        // open image gallery
        launchImageLibrary(
            {
                selectionLimit: 10,
                maxWidth: 500,
                maxHeight: 500,
                quality: 1,
            },
            res => {
                // if user selected an image {...}
                if (!res.didCancel) {
                    this.finish(res);
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
        // show loading indicator
        this.setState({ isLoading: true });

        const order = this.props.route.params.order;

        const updatedOrder = {
            images: this.state.selectedImages,
            status: 'complete',
            dt_completed: new Date()
        }

        // update order with results
        await this.props.updateOrder(order._id, updatedOrder);

        let maintenancePlan = order.customer.garden_info.maintenance_plan;

        // if customer selected a maintenance plan {...}
        if ((maintenancePlan !== 'none') && (!order.customer.payment_info.plan_id)) {

            // NOTE: This check is necessary because for the new mobile schema we use plan id's instead of name strings - change when mobile app development is done
            if (maintenancePlan !== 'full plan' && maintenancePlan !== 'assisted plan') {

                // set maintance plan
                const plan = this.props.plans.find((plan) => plan._id === maintenancePlan);

                maintenancePlan = plan.type;
            }

            const orderDescription = (maintenancePlan === 'full plan') ? vars.orderDescriptions.customer.fullPlan : vars.orderDescriptions.customer.assistedPlan;

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
            await this.props.updateUser(`userId=${order.customer._id}`, { paymentInfo: paymentInfo }, true);

            // get pending orders
            await this.props.getOrders(
                `status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`,
            );

            // redirect user to success page
            this.props.navigation.navigate('Order Complete');

            // hide loading indicator
            this.setState({ isLoading: false });
        } else {
            // hide loading indicator
            this.setState({ isLoading: false });
        }
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
                                        size={units.unit4}
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
        plans: state.plans
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
            createSubscription
        },
        dispatch,
    );
}

ImageUpload = connect(mapStateToProps, mapDispatchToProps)(ImageUpload);

export default ImageUpload;

module.exports = ImageUpload;