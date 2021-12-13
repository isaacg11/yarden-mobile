import axios from 'axios'
import { API_URL } from '../../helpers/getUrl';
import config from '../../config/index';

export function sendEmail(info) {
    return async function() {
        try {
            const email = {
                to: info.email,
                subject: info.subject,
                bcc: (__DEV__) ? null : config.email,
                html:
                '<table style="margin: 0 auto; border-bottom: 2px solid #DDDDDD"; width="600px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td>' +
                            '<img src="https://s3-us-west-1.amazonaws.com/yarden-garden/brand.png" style="width: 30%" />' +
                        '</td>' +
                        '<td>' +
                            '<h3 style="text-align: right;">' + info.label + '</h3>' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
                '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td style="padding-top: 15px;">' +
                            info.body + 
                        '</td>' +
                    '</tr>' +
                '</table>' +
                '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td style="padding-top: 15px;">' +
                            '<span style="color:#a6a6a6">This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message. For support, please contact (888) 828-9287</span></p>' +
                        '</td>' +
                    '</tr>' +
                '</table>'
            }
    
            axios.post(`${API_URL}/emails`, email);
        }

        catch(error) {
            alert(error, 'Something went wrong. We are working on a fix now!');
        }
    }
}