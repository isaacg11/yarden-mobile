import React, {Component} from 'react';
import {View, Modal, ScrollView, Text} from 'react-native';
import Link from '../UI/Link';
import Header from '../UI/Header';
import Label from '../UI/Label';
import units from '../../components/styles/units';
import fonts from '../../components/styles/fonts';
import colors from '../styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

class ElectronicSignatureAgreement extends Component {
  render() {
    const {isOpen = false, close} = this.props;

    return (
      <View>
        {/* agreement modal start */}
        <Modal
          animationType="slide"
          visible={isOpen}
          presentationStyle="fullScreen">
          <View style={{marginTop: units.unit5}}>
            <View style={{padding: units.unit5}}>
              <ScrollView>
                <Link
                  icon={
                    <Ionicons
                      name="chevron-back"
                      size={fonts.h3}
                      color={colors.purpleB}
                    />
                  }
                  text={'Back'}
                  onPress={() => close()}
                />
                <Header type="h4" style={{marginTop: units.unit4}}>
                  Electronic Record and Signature Disclosure
                </Header>

                <Text style={{color: colors.purpleD75}}>
                  {'\n'}
                  Please read this Electronic Record and Signature Disclosure
                  (“Disclosure”) carefully. It contains important information.
                </Text>
                <Label>
                  {'\n'}
                  {'\n'}
                  In this Disclosure:
                </Label>

                <Text style={{...fonts.small}}>
                  “We,” “us,” and “our” means the person or organization using
                  the Yarden Sign Service to present you with Communications to
                  review and/or sign, and our current and future affiliates and
                  assignees (if any). Yarden Garden, Inc., and its affiliates
                  are not parties to this Disclosure unless Yarden Garden, Inc.,
                  or one of its affiliates is the party using the Yarden Sign
                  Service to present these Communications to you. “You” and
                  “your” means to the person giving consent to the use of
                  electronic signatures and records. "Communications” mean all
                  the documents and information we provide to you through the
                  Yarden Sign Service to review, or that you use the Yarden Sign
                  Service to sign or submit or agree to at our request, which
                  are related to your Transaction. Communications include but
                  are not limited to disclosures, notices, agreements,
                  promissory notes, statements, undertakings, and other
                  information. “Box Sign Service” means the Yarden electronic
                  signing platform you are using to electronically review and
                  sign Communications. “Transaction” means the consumer or
                  business transaction for which you are reviewing and signing
                  Communications using the Yarden Sign Service. From time to
                  time, we may be required by law to provide you with certain
                  information related to the Transaction “in writing” – which
                  means you have a right to receive that information on paper.
                  However, with your consent, we may provide this information to
                  you electronically instead. We also need your general consent
                  to use electronic records and signatures.
                  {'\n'}
                  {'\n'}
                  Your electronic signature on Communications presented and
                  signed through the Yarden Sign Service will be just as
                  enforceable as a handwritten signature on a paper document.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Label>1. Scope of Your Consent</Label>
                  {'\n'}
                  This Disclosure applies to all Communications that we may
                  provide to you through the Yarden Sign Service. Your consent
                  to the use of electronic signatures and records does not mean
                  that we are required to complete any Transaction or provide
                  any Communication to you electronically. We may, at our
                  option, complete any Transaction and deliver any Communication
                  to you on paper, and require you to execute any Communication
                  manually, should we choose to do so.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Label>2. Keeping and Obtaining Paper Copies</Label>
                  {'\n'}
                  You will have the opportunity to print out and retain a copy
                  of all the Communications you review or sign at our request
                  through the Yarden Sign Service. You have a right to obtain
                  paper copies of any information we are required to provide you
                  “in writing.” The Yarden Sign Service gives you the
                  opportunity to print copies of Communications you review
                  and/or sign. You may also request a paper copy of any
                  Communication by contacting us at the customer service contact
                  information associated with the Transaction, provided that you
                  provide us with sufficient information to identify the
                  Transaction and the Communications you are requesting. We may
                  charge you a service fee for any paper copies that you
                  request. Any service fee for paper copies you request will be
                  disclosed to you before you are charged.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Label>3. System Requirements</Label>
                  {'\n'}
                  To review and sign Communications electronically using the
                  Yarden Sign Service, you must have:
                  {'\n'}
                  {'\n'}
                  An Up-to-Date Version (defined below) of an Internet browser
                  we support, A connection to the Internet, An Up-to-Date
                  Version of an email management program, and A computer and an
                  operating system capable of supporting all of the above. You
                  will also need a printer if you wish to print out and retain
                  records on paper, and electronic storage and an Up-to-Date
                  Version of a program that accurately reads and displays PDF
                  files (such as Adobe Acrobat Reader)if you wish to retain and
                  later view records in electronic form. You must also have an
                  active email address.
                  {'\n'}
                  {'\n'}
                  In some cases, you may also need a specific brand or type of
                  device that can support a particular software application,
                  including an application intended for particular mobile or
                  handheld devices.
                  {'\n'}
                  {'\n'}
                  By “Up-to-Date Version,” we mean a version of the software
                  that is being supported by its publisher on the date of your
                  Transaction. Beta versions of software are not supported.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Label>4. How to Withdraw Your Consent</Label>
                  {'\n'}
                  If you decide to withdraw your consent to the use of
                  electronic signatures and records before you complete the
                  Transaction, you may do so by:
                  {'\n'}
                  {'\n'}
                  Selecting “Decline Request” in the Yarden Sign Service in the
                  menu under the ellipsis displayed in the upper right corner of
                  the screen presenting the Communication to you for signing, or
                  by Contacting our customer representative assisting you with
                  this Transaction before finishing the signing process. If you
                  withdraw your consent before your Transaction is complete, you
                  will be unable to proceed electronically. You may be required
                  to restart the Transaction via paper, or you may be unable to
                  complete the Transaction at all.
                  {'\n'}
                  {'\n'}
                  Your withdrawal of consent does not affect any other consent
                  you give us at any other time to use electronic records and
                  signatures. Withdrawing consent also does not affect any
                  agreement you make in the Communications, or any other
                  agreement with us, to use electronic records and signatures in
                  the future.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Label>5. Updating Contact Information</Label>
                  {'\n'}
                  You may update your contact information with us at any time
                  by:
                  {'\n'}
                  {'\n'}
                  Notifying our customer service representative assisting you,
                  Calling us at the customer service contact information
                  associated with your Transaction, or Using any online process
                  we make available to you for updating contact information.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Label>6. Consent and Acknowledgment</Label>
                  {'\n'}
                  By checking the box indicating your agreement to use
                  electronic records and signatures, you are:
                  {'\n'}
                  {'\n'}
                  Acknowledging that you have read and understand this
                  Disclosure; Consenting to use electronic signatures and
                  records in connection with communications we provide to you
                  through the Yarden Sign Service; Representing and warranting
                  that you are authorized to give consent on behalf of both
                  yourself and any other person entering into the Transaction
                  along with you or on your behalf; and Confirming that you are
                  able to receive, access, and view the information presented
                  electronically via the methods described above.
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
        {/* agreement modal end */}
      </View>
    );
  }
}

module.exports = ElectronicSignatureAgreement;
