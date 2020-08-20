import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                card: '#fff',
                primary: '#135794',
                background: '#f6f6f6',
                secondary: '#135794',
                accent: '#8c9eff',
                error: '#b71c1c',
            },
            dark: {
                primary: "#03a9f4",
                card: "#3b4046",
                background: '#323641',
                secondary: colors.green,
                accent: '#135794',
                error: '#b71c1c',
            },
        },
    },
});