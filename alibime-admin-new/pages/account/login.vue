<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6 col-xl-5">
      <b-alert :show="error" variant="danger"
        >نام کاربری یا رمز عبور اشتباه است!</b-alert
      >
      <b-alert :show="error2" variant="danger">کد وارد شده اشتباه است!</b-alert>
      <div class="card">
        <div class="card-body p-4">
          <div class="text-center w-75 m-auto">
            <div class="auth-logo">
              <nuxt-link to="/" class="logo logo-dark text-center">
                <span class="logo-lg">
                  <img src="~/assets/images/logo.svg" alt="" height="22" />
                </span>
              </nuxt-link>

              <nuxt-link to="/" class="logo logo-light text-center">
                <span class="logo-lg">
                  <img
                    src="~/assets/images/logo-light.svg"
                    alt=""
                    height="32"
                  />
                </span>
              </nuxt-link>
            </div>
          </div>

          <form action="#" @submit.prevent="onSubmit">
            <!-- <b-alert
              variant="danger"
              class="mt-3"
              v-if="true"
              :show="true"
              dismissible
              >{{ notification.message }}</b-alert
            > -->

            <!-- <b-alert
              variant="danger"
              class="mt-3"
              v-model="isAuthError"
              :show="notificationAutoCloseDuration"
              dismissible
              >نام کاربری یا رمز عبور اشتباه است!</b-alert
            > -->

            <div v-if="step === 1">
              <p class="text-muted text-center mb-4 mt-3">
                لطفا نام کاربری و پسورد خود را وارد کنید.
              </p>
              <div class="form-group mb-3">
                <label for="username">نام کاربری</label>
                <input
                  class="form-control"
                  v-model="item.username"
                  type="text"
                  id="username"
                  :state="validateState($v.item.username)"
                  placeholder="نام کاربری خودر را وارد کنید"
                  :class="{ 'is-invalid': submitted && $v.username.$error }"
                />
                <div
                  v-if="submitted && $v.username.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.username.required"
                    >وارد کردن نام کاربری الزامی است</span
                  >
                  <span v-if="!$v.username.username"
                    >لطفا نام کاربری درست وارد کنید!</span
                  >
                </div>
              </div>

              <div class="form-group mb-3">
                <label for="password">رمز</label>
                <div class="input-group input-group-merge">
                  <input
                    v-model="item.password"
                    type="password"
                    id="password"
                    class="form-control"
                    :state="validateState($v.item.password)"
                    placeholder="رمز عبور خود را وارد کنید"
                    :class="{ 'is-invalid': submitted && $v.password.$error }"
                  />

                  <div class="input-group-append" data-password="false">
                    <div class="input-group-text">
                      <span class="password-eye"></span>
                    </div>
                  </div>
                  <div
                    v-if="submitted && !$v.password.required"
                    class="invalid-feedback"
                  >
                    رمز لازم است!
                  </div>
                </div>
              </div>

              <div class="form-group mb-3">
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="checkbox-signin"
                    checked
                  />
                  <label class="custom-control-label" for="checkbox-signin"
                    >به یاد بسپار</label
                  >
                </div>
              </div>
            </div>
            <div v-if="step === 2">
              <p class="text-muted mb-4 mt-3">
                لطفا کد تایید ارسال شده به موبایل خود را وارد کنید
              </p>
              <div class="form-group mb-3">
                <label for="confirmationCode">کد تایید</label>
                <input
                  class="form-control"
                  v-model="item.confirmationCode"
                  type="text"
                  id="confirmationCode"
                  :state="validateState($v.item.confirmationCode)"
                  placeholder="کد تایید را وارد کنید"
                  :class="{
                    'is-invalid': submitted && $v.confirmationCode.$error,
                  }"
                />
                <div
                  v-if="submitted && $v.confirmationCode.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.confirmationCode.required"
                    >وارد کردن کد تایید الزامی است</span
                  >
                  <span v-if="!$v.confirmationCode.confirmationCode"
                    >لطفا کد تایید درست وارد کنید!</span
                  >
                </div>
              </div>
            </div>

            <div class="form-group mb-0 text-center">
              <button class="btn btn-primary btn-block" type="submit">
                <b-spinner v-show="loading" small></b-spinner>
                ورود
              </button>
            </div>
          </form>

          <!-- <div class="text-center">
                    <h5 class="mt-3 text-muted">Sign in with</h5>
                    <ul class="social-list list-inline mt-3 mb-0">
                        <li class="list-inline-item">
                            <a href="javascript: void(0);" class="social-list-item border-purple text-purple"><i class="mdi mdi-facebook"></i></a>
                        </li>
                        <li class="list-inline-item">
                            <a href="javascript: void(0);" class="social-list-item border-danger text-danger"><i class="mdi mdi-google"></i></a>
                        </li>
                        <li class="list-inline-item">
                            <a href="javascript: void(0);" class="social-list-item border-info text-info"><i class="mdi mdi-twitter"></i></a>
                        </li>
                        <li class="list-inline-item">
                            <a href="javascript: void(0);" class="social-list-item border-secondary text-secondary"><i class="mdi mdi-github"></i></a>
                        </li>
                    </ul>
                </div> -->
        </div>
        <!-- end card-body -->
      </div>
      <!-- end card -->

      <!-- <div class="row mt-3">
            <div class="col-12 text-center">
                <p>
                    <nuxt-link to="/account/forgot-password" class="text-muted ml-1">Forgot your password?</nuxt-link>
                </p>
                <p class="text-muted">Don't have an account? <nuxt-link to="/account/register" class="text-primary font-weight-medium ml-1">Sign Up</nuxt-link>
                </p>
            </div> 
        </div> -->
      <!-- end row -->
    </div>
    <!-- end col -->
  </div>
  <!-- end row -->
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, numeric, minLength } from "vuelidate/lib/validators";

/**
 * Login component
 */

export default {
  mixins: [validationMixin],
  data() {
    return {
      item: {
        username: null,
        password: null,
        confirmationCode: null,
      },
      tempToken: "",
      loading: false,
      message: null,
      valid: false,
      errormessage: false,
      visible: false,
      submitted: null,
      isAuthError: null,
      authError: null,
      step: 1,
      error: false,
      error2: false,
    };
  },
  validations: {
    item: {
      username: {
        required,
      },
      password: {
        required,
      },
      confirmationCode: {
        required,
        numeric,
        minLength: minLength(5),
      },
    },
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    notificationAutoCloseDuration() {
      return this.$store && this.$store.state.notification ? 5 : 0;
    },
  },
  // created() {},

  methods: {
    ...mapActions({
      requestOTP: "auth/requestOTP",
      confirmOTP: "auth/confirmOTP",
      getInfo: "auth/getInfo",
    }),
    validateState(item) {
      const { $dirty, $error } = item;
      return $dirty ? !$error : null;
    },
    onSubmit() {
      this.$v.item.$touch();
      // if (this.$v.$invalid) {
      console.log("onSubmit form = ", this.$v.item.$anyESrror); // eslint-disable-line no-console
      console.log("item = ", this.item); // eslint-disable-line no-console
      this.loading = true;
      if (this.step === 1) {
        this.requestOTP({
          username: this.item.username,
          password: this.item.password,
        })
          .then((tempToken) => {
            if (tempToken) {
              this.step = 2;
              this.error = false;
              this.tempToken = tempToken;
            } else {
              this.error = true;
              this.loading = false;
            }
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
          });
      } else {
        this.confirmOTP({
          username: this.item.username,
          confirmationCode: this.item.confirmationCode,
          tempToken: this.tempToken,
        })
          .then(() => {
            // this.step = 1;
            this.visible = false;
            this.loading = false;
            this.getInfo();
            this.$router.push({
              path: `/`,
            });
          })
          .catch((e) => {
            // this.step = 1
            this.loading = false;
            console.log("error number: ", e); // eslint-disable-line no-console
            if (e === 401) {
              this.errormessage = true;
            }
          });
      }
      // }
    },
  },
  layout: "auth",
};
</script>
<style scoped>
.logo-lg img {
  height: 45px;
}
</style>
