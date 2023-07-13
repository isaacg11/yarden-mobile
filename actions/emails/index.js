import axios from 'axios'
import { API_URL } from '../../helpers/getUrl';
import config from '../../config/index';

export function sendEmail(info, query) {
    return async function() {
        try {
            const q = (query) ? `?${query}` : '';
            const email = {
                to: info.email,
                subject: info.subject,
                bcc: (__DEV__) ? null : config.email,
                html:
                '<table style="margin: 0 auto; width="600px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td>' +
                            '<img src="https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/yarden_horizontal_lockup_bg-01.png" style="width: 150px;" />' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
                '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td>' +
                            info.body + 
                        '</td>' +
                    '</tr>' +
                '</table>' +
                '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td style="padding-top: 15px;">' +
                            '<a href="https://www.facebook.com/yardengardeninc"><img src="https://yarden-garden.s3.us-west-1.amazonaws.com/static+assets/fb.png" style="width: 25px; margin-right: 5px;" /></a>' +
                            '<a href="https://www.instagram.com/official_yarden"><img src="https://yarden-garden.s3.us-west-1.amazonaws.com/static+assets/insta.png" style="width: 25px;" /></a>' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
                '<table style="margin: 0 auto;" width="200px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td style="padding-top: 15px; text-align: center;">' +
                            '<span><b>Download on the App Store</b></span>' +
                            '<a href="https://apps.apple.com/us/app/yarden/id1626672979"><img src="https://yarden-garden.s3.us-west-1.amazonaws.com/static+assets/app-store-download.png" style="margin-top: 5px;" /></a>' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
                '<table style="margin: 0 auto;" width="200px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td style="padding-top: 15px; text-align: center;">' +
                            '<p>Leave us a review!</p>' +
                            '<a style="color: black;" href="https://www.google.com/maps/place/Yarden+Garden,+Inc./@39.6610454,-125.4807831,6z/data=!4m12!1m2!2m1!1syarden+garden!3m8!1s0x808f7fbbbf661127:0xb36921cf9a1793d0!8m2!3d37.878638!4d-122.4203375!9m1!1b1!15sCg15YXJkZW4gZ2FyZGVuWg8iDXlhcmRlbiBnYXJkZW6SAQhnYXJkZW5lcpoBJENoZERTVWhOTUc5blMwVkpRMEZuU1VObE5scFBWbmxCUlJBQuABAA!16s%2Fg%2F11tcvh69qv">☆☆☆☆☆</a>' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
                '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td style="padding-top: 15px;">' +
                            '<span style="color:#adc5aa; font-size: 10px;">This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message. For support, please contact (888) 828-9287</span>' +
                        '</td>' +
                    '</tr>' +
                '</table>'
            }
    
            axios.post(`${API_URL}/emails${q}`, email);
        }

        catch(error) {
            alert(error, 'Something went wrong. We are working on a fix now!');
        }
    }
}