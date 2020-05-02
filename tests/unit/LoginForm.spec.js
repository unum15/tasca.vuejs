import { shallowMount } from '@vue/test-utils';
import LoginForm from '@/components/LoginForm.vue';
jest.mock('vue-axios');

describe('LoginForm.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(LoginForm, {
            mocks: {
                $http: {
                    get: () => {
                        return Promise.resolve({ data: {login: 'data'} });
                    }
                }
            }
        });
    expect(wrapper.text()).toMatch('Please sign in');
  });
});
