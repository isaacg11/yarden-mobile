import vars from '../vars/index';

export default function getOrderDescription(type) {
    switch (type) {
        case 'yard assessment':
            return vars.orderDescriptions.customer.yardAssessment;
        case 'installation':
            return vars.orderDescriptions.customer.installation;
        case 'revive':
            return vars.orderDescriptions.customer.revive;
        case 'crop rotation':
            return vars.orderDescriptions.customer.cropRotation;
        case 'initial planting':
            return vars.orderDescriptions.customer.initialPlanting;
        case 'full plan':
            return vars.orderDescriptions.customer.fullPlan;
        case 'assisted plan':
            return vars.orderDescriptions.customer.assistedPlan;
        default:
            return 'n/a';
    }
}