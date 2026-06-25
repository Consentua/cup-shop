<template>
    <div id="CookieConsent"  @click="closeCookieModal()" >
        <div id="cookie-consent-container">
            <iframe scrolling="no" id="cookie-consent-iframe" src=""></iframe>
            <el-button @click="closeCookieModal()">Close</el-button>
        </div>
    </div>
</template>

<script>
import ConsentuaUIWrapper from '@/js/consentua-embed.js'
import {TweenMax, Power4} from 'gsap'
export default {
    name: 'CookieConsent',
    computed: {
      open:{
        get: function () {
          return this.$store.state.cookiePopOpen
        },
        set: function (val) {
        this.$store.commit({
                type: '_toggleCookiePopOpen',
                value: val
            })
        }
      }
    },
    methods: {
        openCookieModal() {
            this.open = true;
        },
        closeCookieModal() {
            this.open = false;
        },
        isConsented() {
            //user consented, do stuff:      
            this.$message({
                message: 'Consent given, creating cookie!',
                type: 'success'
            });
            this.$cookie.set('consented_cookie', 'You_gave_your_consent_for_this_cookie', 1);
            //close popup   
            window.setTimeout(function () {
                this.open = false;
            }, 950);
        },
        notConsented() {
            //user not consented, do stuff:      
            this.$message({
                message: 'Consent not given, deleting cookie!',
                type: 'warning'
            });
            // cookie will be deleted in the store.js
        },
        cb_ready(msg) {
            // when ready (onload)

            // get stored consents
            let cookiConsent = this.$store.state.consentuaConsents.find(function (consent) {
                return consent.id == '236';
            });

            if (!cookiConsent) {
                // no consents
                this.openCookieModal();
            } else if (cookiConsent.consent) {
                // is consneted
                this.isConsented();
            } else {
                this.openCookieModal();
            }
            //store uid for demo
            if (!this.$store.state.consentuaUID) {
                this.$store.commit({
                    type: 'updateConsentuaUID',
                    value: msg.message.uid
                })
            }
        },
        cb_set(msg) {
            //update when consent is cahnged
            if (msg.message.consents['236']) {
                // consent is true
                this.isConsented();
            } else if (!msg.message.consents['236']) {
                // consent is false
                this.notConsented();
            }
            //store consents for demo
            this.$store.commit({
                type: 'updateConsentuaConsents',
                value: msg.message.consents
            })
        },
        cb_msg(msg) {
            console.warn("Consent received from Consentua", msg);
        }
    },
    mounted() {
        TweenMax.set(this.$el, {
            y: this.$el.offsetHeight
        })
        // Consentua
        let tid = '63'; // Template ID
        var iframe = document.querySelector('#cookie-consent-iframe');
        var cookie_cwrap = new ConsentuaUIWrapper(iframe, this.$store.state.cid, this.$store.state.consentuaUID, tid, this.$store.state.sid, this.$store.state.skey, this.cb_msg, 'en', {
            ix: "http://cupshop.consentua.com/consent-interactions/cup-cookie-consent.html"
        });
        // set cb
        cookie_cwrap.onset = this.cb_set;
        cookie_cwrap.onready = this.cb_ready;
    },
    watch: {
      open: function (open) {
        const dX = open ? 0 : this.$el.offsetHeight + 500
        TweenMax.to(this.$el, 0.6, {
          y: dX,
          ease: Power4.easeOut
        })
      }
    }
}
</script>

<style>
#CookieConsent {
    /* visibility: hidden; */
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(55, 55, 55, 0.61);
    /* animation-name: animatefade; */
    animation-duration: 0.4s;
}

#CookieConsent #cookie-consent-container {
    max-height: 90vh;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    background-color: #fff;
    border-radius: 1.3rem;
    text-align: center;
    animation-duration: 0.6s;
}

#cookie-consent-iframe {
    border: none;
}

#cookie-consent-container .btn {
    margin: 0.7rem;
}

@media only screen and (min-width: 550px),
screen and (min-height: 660px) {
    #cookie-consent-container {
        min-width: 320px;
        max-width: 60vw;
        max-height: 80vh;
        margin: 1rem auto;
    }
}
</style>
