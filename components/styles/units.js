import ratio from './ratio';

// units
const unit0 = 1;
const unit1 = unit0 * ratio.unitScaleRatio;
const unit2 = unit1 * ratio.unitScaleRatio;
const unit3 = unit2 * ratio.unitScaleRatio;
const unit4 = unit3 * ratio.unitScaleRatio;
const unit5 = unit4 * ratio.unitScaleRatio;

const units = {
    unit0,
    unit1,
    unit2,
    unit3,
    unit4,
    unit5
}

export default units;