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
            cropRotation: 'Bi-annual rotation of plants for the new grow season',
            fullPlan: 'Weekly garden maintenance. Service includes weed abatement, irrigation management, harvesting, seasonal crop rotation, and plant replacement.',
            assistedPlan: 'Bi-weekly garden maintenance. Service includes weed abatement, irrigation management, harvesting, and seasonal crop rotation.',
            initialPlanting: 'Initial planting of seeds and plants in garden beds. Sowing seeds and adding plant starts.'
        }
    },
    harvest_instructions: {
        fruit: [
            'Determine when the fruit is ripe. Different fruits have different indicators of ripeness. For example, some fruits like tomatoes will become softer and change color as they ripen, while others like apples will be ready to pick when they come off the tree easily.',
            'Gather your supplies. You will need a pair of clean pruning shears to cut the fruit from the plant. You may also want to have a basket or bag to collect the fruit as you harvest it.',
            'Carefully cut the fruit from the plant. Use the scissors or pruning shears to cut the stem of the fruit, being careful not to damage the plant or surrounding fruit.',
            'Place the fruit in your basket or bag. Gently place the fruit in your container, taking care not to bruise or damage it.',
            'Continue harvesting until you have collected all of the ripe fruit. Be sure to check the plant regularly, as some fruit may ripen at different times.',
            'Wash and store the fruit as needed. Rinse the fruit under cool water to remove any dirt or debris, and then store it in the refrigerator or a cool, dry place until you are ready to use it.'
        ],
        pod: [
            'Determine when the pods are ready to be harvested. Different plants have different indicators of ripeness. For example, some pods like peas will be ready to pick when they are plump and full, while others like beans will be ready when they are firm but not hard.',
            'Gather your supplies. You will need a pair of clean pruning shears to cut the pods from the plant. You may also want to have a basket or bag to collect the pods as you harvest them.',
            'Carefully cut the pods from the plant. Use the scissors or pruning shears to cut the stem of the pods, being careful not to damage the plant or surrounding pods.',
            'Place the pods in your basket or bag. Gently place the pods in your container, taking care not to bruise or damage them.',
            'Continue harvesting until you have collected all of the ripe pods. Be sure to check the plant regularly, as some pods may ripen at different times.',
            'Wash and store the pods as needed. Rinse the pods under cool water to remove any dirt or debris, and then store them in the refrigerator or a cool, dry place until you are ready to use them.'
        ],
        root: [
            'Determine when the roots are ready to be harvested. Different plants have different indicators of ripeness. For example, some roots like carrots will be ready to pick when they are firm and full, while others like beets will be ready when they are a deep red color.',
            'Gather your supplies. You will need a garden fork or spade to loosen the soil around the roots, as well as a pair of gloves to protect your hands. You may also want to have a basket or bag to collect the roots as you harvest them.',
            'Loosen the soil around the roots. Use the garden fork or spade to gently loosen the soil around the roots, being careful not to damage the roots.',
            'Carefully lift the plant out of the ground. Grasp the plant near the base and gently lift it out of the ground, taking care not to break the roots.',
            'Wash and store the roots as needed. Rinse the roots under cool water to remove any dirt or debris, and then store them in the refrigerator or a cool, dry place until you are ready to use them.'
        ],
        bud: [
            'Determine when the buds are ready to be harvested. Different plants have different indicators of ripeness. For example, some buds like flower buds will be ready to pick when they are firm and full, while others like leaf buds will be ready when they are just starting to open.',
            'Gather your supplies. You will need a pair of clean pruning shears to cut the buds from the plant. You may also want to have a basket or bag to collect the buds as you harvest them.',
            'Carefully cut the buds from the plant. Use the scissors or pruning shears to cut the stem of the buds, being careful not to damage the plant or surrounding buds.',
            'Place the buds in your basket or bag. Gently place the buds in your container, taking care not to bruise or damage them.',
            'Continue harvesting until you have collected all of the ripe buds. Be sure to check the plant regularly, as some buds may ripen at different times.',
            'Wash and store the buds as needed. Rinse the buds under cool water to remove any dirt or debris, and then store them in the refrigerator or a cool, dry place until you are ready to use them.'
        ],
        leaf: [
            'Determine when the leaves are ready to be harvested. Different plants have different indicators of ripeness. For example, some leaves like basil will be ready to pick when they are firm and full, while others like lettuce will be ready when they are a deep green color.',
            'Gather your supplies. You will need a pair of clean pruning shears to cut the leaves from the plant. You may also want to have a basket or bag to collect the leaves as you harvest them.',
            'Carefully cut the leaves from the plant. Use the scissors or pruning shears to cut the stem of the leaves, being careful not to damage the plant or surrounding leaves.',
            'Place the leaves in your basket or bag. Gently place the leaves in your container, taking care not to bruise or damage them.',
            'Continue harvesting until you have collected all of the ripe leaves. Be sure to check the plant regularly, as some leaves may ripen at different times.',
            'Wash and store the leaves as needed. Rinse the leaves under cool water to remove any dirt or debris, and then store them in the refrigerator or a cool, dry place until you are ready to use them.'
        ],
        stem: [
            'Determine when the stems are ready to be harvested. Different plants have different indicators of ripeness. For example, some stems like asparagus will be ready to pick when they are firm and full, while others like rhubarb will be ready when they are a deep red color.',
            'Gather your supplies. You will need a pair of clean pruning shears to cut the stems from the plant. You may also want to have a basket or bag to collect the stems as you harvest them.',
            'Carefully cut the stems from the plant. Use the scissors or pruning shears to cut the stem of the plant, being careful not to damage the plant or surrounding stems.',
            'Place the stems in your basket or bag. Gently place the stems in your container, taking care not to bruise or damage them.',
            'Continue harvesting until you have collected all of the ripe stems. Be sure to check the plant regularly, as some stems may ripen at different times.',
            'Wash and store the stems as needed. Rinse the stems under cool water to remove any dirt or debris, and then store them in the refrigerator or a cool, dry place until you are ready to use them.'
        ],
        flower: [
            'Determine when the flowers are ready to be harvested. Different plants have different indicators of ripeness. For example, some flowers like roses will be ready to pick when they are fully open and fragrant, while others like sunflowers will be ready when they are just starting to open.',
            'Gather your supplies. You will need a pair of clean pruning shears to cut the flowers from the plant. You may also want to have a vase or container to hold the flowers once they are cut.',
            'Carefully cut the flowers from the plant. Use the scissors or pruning shears to cut the stem of the flowers, being careful not to damage the plant or surrounding flowers.',
            'Place the flowers in your vase or container. Fill the vase with water and add a flower preservative, if desired. Then gently place the flowers in the vase, taking care not to bruise or damage them.',
            'Continue harvesting until you have collected all of the ripe flowers. Be sure to check the plant regularly, as some flowers may open at different times.'
        ],
        seed: [
            'Determine when the seeds are ready to be harvested. Different plants have different indicators of ripeness. For example, some seeds like beans will be ready to pick when they are dry and hard, while others like sunflowers will be ready when the flower head starts to dry and turn brown.',
            'Gather your supplies. You will need a pair of clean pruning shears to cut the seed heads from the plant. You may also want to have a basket or bag to collect the seeds as you harvest them.',
            'Carefully cut the seed heads from the plant. Use the scissors or pruning shears to cut the stem of the seed heads, being careful not to damage the plant or surrounding seed heads.',
            'Place the seed heads in a dry, well-ventilated area to dry. Spread out the seed heads on a sheet of paper or a tray and place them in a dry, well-ventilated area out of direct sunlight. Allow the seeds to dry completely, which may take a few days to a week or more depending on the humidity and temperature.',
            'Remove the seeds from the seed heads. Once the seeds are dry, gently rub the seed heads between your hands to loosen the seeds. Alternatively, you can use a small brush or your fingers to remove the seeds from the seed heads.',
            'Store the seeds in an airtight container. Transfer the seeds to an airtight container and store them in a cool, dry place until you are ready to use them.'
        ],
        head: [
            'Identify the vegetable that you want to harvest. Vegetables such as broccoli, cauliflower, and lettuce have a head that is ready for harvest.',
            'Check the size of the head. It should be firm and fully developed. If the head is still small or soft, it is not ready for harvest.',
            'Use a sharp knife or garden shears to cut the stem of the head, leaving a few inches of stem attached to the plant. Be sure to cut the stem at an angle to prevent water from pooling in the cut area.',
            'Carefully remove the head from the plant, being careful not to damage the surrounding leaves or stems.',
            'Rinse the head under cool water to remove any dirt or debris.',
            'Use the head immediately or store it in a cool, dry place. If you plan to store it, wrap it in a damp paper towel or place it in a plastic bag with a damp paper towel to keep it fresh.'
        ],
        ear: [
            'Locate the vegetable in your garden that has an ear. This could be corn, wheat, or any other vegetable that has an ear or seed head.',
            'Check the ears to see if they are fully mature. The ears should be plump and the kernels should be fully developed.',
            'Cut the stem of the ear just above the ear. Use a sharp pair of scissors or pruning shears to make a clean cut.',
            'Gently shake the ear to loosen any remaining silks or husks.',
            'Carefully remove the husks from the ear, exposing the kernels.',
            'Inspect the ear for any signs of insect damage or mold. Discard any ears that are not suitable for consumption.',
            'Store the harvested ears in a cool, dry place until ready to use. They can be used fresh, dried or stored in a container to be used later.'
        ]
    },
    tax: {
        ca: 0.1
    },
    fees: {
        maintenance: 0.4,
        misc: 0.1,
        payment_processing: 0.03
    },
    labor: {
        rate: 35,
        description: 'hourly rate'
    }
}

export default vars;