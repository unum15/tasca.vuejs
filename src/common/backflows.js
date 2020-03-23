export default {
    passed(item) {
        let passed = null;
        switch(item.backflow_type.backflow_super_type.name){
            case 'DC':
                passed = item.reading_1 >= 1 && item.reading_2 >= 1;
                break;
            case 'PVB':
                passed=item.reading_1 >= 1 && item.reading_2 >= 1;
                break;
            case 'RP':
                passed=(item.reading_1  >= 2) && (item.reading_2 - item.reading_1 >= 5);
                break;
        }
        return passed;
    }
};

