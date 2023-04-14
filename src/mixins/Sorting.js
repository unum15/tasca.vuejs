import moment from 'moment';
export default {
    methods: {
        sortCompare(a, b, key, sortDesc, formatter) {
            const valueA = formatter ? formatter(a[key], key, a) : a[key];
            const valueB = formatter ? formatter(b[key], key, b) : b[key];
            switch(key){
                case 'time':
                case 'date':
                    var value = 0;
                    if(a.date && b.date){
                        var first_date = moment(a.date);
                        var second_date = moment(b.date);
                        value = first_date.diff(second_date, 'days');
                    }
                    else{
                        if(a.date){
                            value = 1;
                        }
                        else{
                            if(b.date){
                                value = -1;
                            }
                        }
                    }
                    if(value == 0){
                        value = this.sortCompare(a, b, 'sort_order');
                        if(value == 0){
                            if(a.time == b.time){
                                return this.sortCompare(a, b, 'start_date');
                            }
                            else{
                                return a.time < b.time;
                            }
                        }
                        else{
                            return value;
                        }
                    }
                    else{
                        return value;
                    }
                default:
                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                    } else {
                      return this.toString(valueA).localeCompare(this.toString(valueB), undefined, {
                        numeric: true
                      });
                    }
            }
        },
        toString(value) {
            if (!value) {
              return '';
            } else if (value instanceof Object) {
              return Array.keys(value)
                .sort()
                .map(key => toString(value[key]))
                .join(' ');
            }
            return String(value);
        },
    }
};