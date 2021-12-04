const vars = {
    orderDescriptions: {
        vendor: {
            yardAssessment: 'Meet with customer at the date/time listed. Take measurements of garden area. If the customer would like a new garden, give them a verbal quote for installation (see pricing page). Otherwise, if the customer would like to revive their old garden, give them a verbal quote for a revive service (see pricing page). Take 2 pictures: 1 of the garden area, and 1 of the water source. Upload results to complete the order.',
            installation: 'Garden installation',
            revive: 'Garden revive',
            cropRotation: 'Garden crop rotation',
            fullPlan: 'Provide garden maintenance for this garden once a week. Follow the maintenance guidelines listed in your Yardener handbook. Clean up any materials or debris before leaving the garden site. Take 2 pictures: 1 of the garden, and 1 of any vegetables or herbs that were harvested during your visit (if no harvest just take 1 picture of the garden). Upload results to complete the order.',
            assistedPlan: 'Provide garden maintenance for this garden once every 2 weeks. Follow the maintenance guidelines listed in your Yardener handbook. Clean up any materials or debris before leaving the garden site. Take 2 pictures: 1 of the garden, and 1 of any vegetables or herbs that were harvested during your visit (if no harvest just take 1 picture of the garden). Upload results to complete the order.',
            initialPlanting: 'Plant the garden using the list provided. Take 2 pictures: 1 before the planting, and 1 after the planting. Upload results to complete the order.'
        },
        customer: {
            yardAssessment: 'Meet with one of our gardeners for an on-site appointment! Get a quote for a garden and answers to all your questions.',
            installation: 'Installation of new garden. Service includes building beds, adding soil / amendments, and setting up drip irrigation.',
            revive: 'Revival of current garden. Service includes adding soil / amendments, and setting up drip irrigation',
            cropRotation: 'tbd',
            fullPlan: 'Weekly garden maintenance. Service includes weed abatement, irrigation management, harvesting, seasonal crop rotation, and plant replacement.',
            assistedPlan: 'Bi-weekly garden maintenance. Service includes weed abatement, irrigation management, harvesting, and seasonal crop rotation.',
            initialPlanting: 'Initial planting of seeds and plants in garden beds. Sowing seeds and adding plant starts.'
        }
    },
    tax: {
        ca: 0.1
    },
    fees: {
        maintenance: 0.4,
        misc: 0.1,
        payment_processing: 0.03
    }
}

export default vars;