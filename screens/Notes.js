// libraries
import React, {Component} from 'react';
import {KeyboardAvoidingView, View, Image, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../components/UI/Header';
import Label from '../components/UI/Label';
import Paragraph from '../components/UI/Paragraph';
import Card from '../components/UI/Card';
import CircularButton from '../components/UI/CircularButton';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';

// actions
import {createNote, getNotes} from '../actions/notes/index';

// helpers
import calculateDaysToMature from '../helpers/calculateDaysToMature';

// styles
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';
import colors from '../components/styles/colors';

class Notes extends Component {
  state = {
    isLoading: false,
    newNote: '',
  };

  async componentDidMount() {
    const selectedPlant = this.props.route.params.selectedPlant;
    const bed = this.props.beds.find(
      b => b.key === this.props.route.params.bedId,
    );

    // get notes
    await this.props.getNotes(
      `plant=${selectedPlant.id._id}&bed=${bed._id}&key=${selectedPlant.key}&dt_planted=${selectedPlant.dt_planted}`,
    );
  }

  async saveNote() {
    // show loading indicator
    this.setState({isLoading: true});

    const selectedPlant = this.props.route.params.selectedPlant;
    const bed = this.props.beds.find(
      b => b.key === this.props.route.params.bedId,
    );
    const note = {
      text: this.state.newNote,
      owner: this.props.user._id,
      plant: selectedPlant.id._id,
      bed: bed._id,
      key: selectedPlant.key,
      dt_planted: selectedPlant.dt_planted,
      dt_created: new Date(),
    };

    // create new note
    await this.props.createNote(note);

    // get notes
    await this.props.getNotes(
      `plant=${selectedPlant.id._id}&bed=${bed._id}&key=${selectedPlant.key}&dt_planted=${selectedPlant.dt_planted}`,
    );

    // hide loading indicator
    this.setState({
      isLoading: false,
      isCreatingNote: false,
      newNote: '',
    });
  }

  render() {
    const {selectedPlant} = this.props.route.params;
    const {notes} = this.props;
    const {isCreatingNote, newNote} = this.state;
    const daysToMature = calculateDaysToMature(selectedPlant);

    return (
      <KeyboardAvoidingView behavior="padding">
        <Card
          style={{
            display: 'flex',
            paddingTop: units.unit6,
          }}>
          {/* plant image / name */}
          <View style={{alignItems: 'center'}}>
            <Image
              source={{uri: selectedPlant.id.common_type.image}}
              style={{
                height: 100,
                width: 100,
                marginBottom: units.unit3,
              }}
            />
            <Header style={{color: colors.purpleB}}>
              {selectedPlant.id.name} {selectedPlant.id.common_type.name}
            </Header>
            <Label>{selectedPlant.id.family_type.name}</Label>
          </View>

          {/* plant info */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: units.unit5,
            }}>
            <View>
              <Label>ID#</Label>
              <Paragraph>{selectedPlant.key}</Paragraph>
            </View>
            <View>
              <Label>Planted:</Label>
              <Paragraph>
                {moment(selectedPlant.dt_planted).format('MM/DD/YY')}
              </Paragraph>
            </View>
            <View>
              <Label>Season:</Label>
              <Paragraph>{selectedPlant.id.season}</Paragraph>
            </View>
            <View>
              <Label>Mature In:</Label>
              {daysToMature < 1 ? (
                <Paragraph>Ready!</Paragraph>
              ) : (
                <Paragraph>
                  {daysToMature} {daysToMature > 1 ? 'days' : 'day'}
                </Paragraph>
              )}
            </View>
          </View>
        </Card>

        {/* note container */}
        <KeyboardAwareScrollView
          style={{
            backgroundColor: colors.greenE10,
            height: '100%',
            paddingHorizontal: units.unit4,
            paddingVertical: units.unit4,
          }}>
          <Text style={{color: colors.greenD50}}>
            Help yourself keep track of this plant by creating a note. Notes are
            not visible to the customer.
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Header style={{color: colors.purpleB}}>Notes</Header>
            <View style={{opacity: isCreatingNote ? 0 : null}}>
              <CircularButton
                small
                icon={
                  <Ionicons
                    name={'add'}
                    color={colors.purpleB}
                    size={fonts.h3}
                  />
                }
                onPress={() => this.setState({isCreatingNote: true})}
              />
            </View>
          </View>

          {/* new note input () */}
          {isCreatingNote && (
            <View style={{marginTop: units.unit4}}>
              <Input
                multiline
                numberOfLines={5}
                value={newNote}
                onChange={value => this.setState({newNote: value})}
                placeholder="Write note here..."
                label="New Note"
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Button
                  small
                  text="Cancel"
                  variant="btn5"
                  onPress={() =>
                    this.setState({
                      isCreatingNote: false,
                      newNote: '',
                    })
                  }
                />
                <Button
                  small
                  text="Save"
                  disabled={newNote.length < 1}
                  onPress={() => this.saveNote()}
                />
              </View>
            </View>
          )}

          {/* note list */}
          {notes.map((note, index) => (
            <View key={index} style={{paddingTop: units.unit4}}>
              <Divider />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingVertical: units.unit4,
                }}>
                <Image
                  source={{
                    uri: note.owner.profile_image,
                  }}
                  style={{
                    width: units.unit5,
                    height: units.unit5,
                    borderRadius: 100,
                  }}
                />
                <View style={{paddingLeft: units.unit3}}>
                  <Text style={{textTransform: 'capitalize'}}>
                    {note.owner.first_name} {note.owner.last_name[0]}.
                  </Text>
                  <Label>{moment(note.dt_created).format('MM/DD/YYYY')}</Label>
                </View>
              </View>
              <Text>{note.text}</Text>
            </View>
          ))}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    beds: state.beds,
    notes: state.notes,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createNote,
      getNotes,
    },
    dispatch,
  );
}

Notes = connect(mapStateToProps, mapDispatchToProps)(Notes);

export default Notes;

module.exports = Notes;
