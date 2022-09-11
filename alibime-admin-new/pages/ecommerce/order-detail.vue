<script>
import moment from "moment-jalaali";
import VueNumeric from "vue-numeric";
export default {
  head() {
    return {
      title: `داشبورد - ${this.title} | علی بیمه`,
    };
  },
  components: {
    VueNumeric,
  },
  data() {
    return {
      title: "جزئیات سفارش",
      items: [
        {
          text: "علی بیمه",
        },
        {
          text: "سفارشات",
        },
        {
          text: "جزئیات سفارش",
          active: true,
        },
      ],
      trackingCode: 0,
      insType: null,
      mobileNumber: 0,
      orderPrice: null,
      carValue: null,
      carTypeName: null,
      carModelName: null,
      carBrandName: null,
      carBuildYear: null,
      company: null,
      previousCompany: null,
      status: 0,
      thirdPartyDiscount: null,
      driverDiscount: null,
      updatedDate: null,
      createdDate: null,
      createdTime: null,
      discount: 0,
      maaliat: 0,
      whithoutMaaliat: 0,
      transactionId: 0,
      amount: 0,
      payCreatedDate: null,
      payCreatedTime: null,
      fullName: "",
      nationalCode: 0,
      fullAddress: "",

      jarimeDirkard: null,
      jarimeDirkardDay: null,

      financialDamage: null,
      lifeDamage: null,
      havadesDamage: null,

      lastPolicyExpDate: null,
      lastPolicyStartDate: null,

      carCardFront: null,
      carCardBack: null,
      carLastIns: null,
      govahinameImage: null,

      showmodal: false,
      statusCode: null,

      showmodalCardFront: false,
      showmodalCardBack: false,
      showmodalPrevIns: false,
      showmodalGovahiname: false,

      submitted: false,
    };
  },
  middleware: ["check-auth", "auth"],
  mounted() {
    this.orderId = this.$route.query.order_id;
    this.getOrderData(this.orderId);
  },
  methods: {
    coverSelected() {
      if (this.coverChemical) {
      }
    },
    getOrderData(id) {
      this.$store.dispatch("orders/getOrderbyID", id).then((result) => {
        console.log(result, "order get by id done."); // eslint-disable-line
        this.trackingCode = result.tracking_code;
        this.insType = result.insType;
        this.mobileNumber = result.mobileNumber;
        this.nationalCode = result.nationalCode;
        this.statusCode = result.status;
        this.fullName = result.firstName + " " + result.lastName;
        this.createdDate = moment(result.createdDate).format("jYYYY/jM/jD");
        this.createdTime = moment(result.createdDate).format("HH:mm:ss");
        this.lastPolicyStartDate = moment(result.lastPolicyStartDate).format(
          "jYYYY/jM/jD"
        );
        this.lastPolicyExpDate = moment(result.lastPolicyExpDate).format(
          "jYYYY/jM/jD"
        );
        this.company = result.company;
        this.previousCompany = result.insStatus;
        this.carBrandName = result.carBrandName;
        this.carModelName = result.carModelName;
        this.carTypeName = result.carTypeName;
        this.carBuildYear = result.carBuildYear;
        this.thirdPartyDiscount = result.DisThirdparty;
        this.driverDiscount = result.DisDriver;
        this.financialDamage = result.financialDamage;
        this.havadesDamage = result.havadesDamage;
        this.lifeDamage = result.lifeDamage;
        this.whithoutMaaliat = result.whithoutMaaliat;
        this.maaliat = result.maaliat;
        this.jarimeDirkard = result.jarimeDirkard;
        this.jarimeDirkardDay = result.jarimeDirkardDay;
        this.orderPrice = result.orderPrice;
        this.fullAddress = result.address;

        if (result.carCardImageFrontUrl) {
          this.carCardFront = result.carCardImageFrontUrl;
          this.getImage(this.carCardFront, "carCardImageFrontUrl");
        }
        if (result.carCardImageBackUrl) {
          this.carCardBack = result.carCardImageBackUrl;
          this.getImage(this.carCardBack, "carCardImageBackUrl");
        }
        if (result.carLastInsImageUrl) {
          this.carLastIns = result.carLastInsImageUrl;
          this.getImage(this.carLastIns, "carLastInsImageUrl");
        }
        if (result.govahinameImageUrl) {
          this.govahinameImage = result.govahinameImageUrl;
          this.getImage(this.govahinameImage, "govahinameImageUrl");
        }
        this.getTransactionData(this.trackingCode);
      });
      // this.$store.dispatch()
      console.log(this.trackingCode); // eslint-disable-line
    },
    getTransactionData(id, timeout) {
      setTimeout(() => {
        console.log(id); // eslint-disable-line
        this.$store.dispatch("transactions/getTransbyID", id).then((result) => {
          console.log(result, "Transaction get by id done."); // eslint-disable-line
          this.transactionId = result.transactionId;
          this.amount = result.amount;
          this.payCreatedDate = moment(result.createdDate).format(
            "jYYYY/jM/jD"
          );
          this.payCreatedTime = moment(result.createdDate).format("HH:mm:ss");
        });
      }, timeout * 2000);
    },
    parseOrderStatus(statusCode) {
      if (statusCode == 11) {
        return "در انتظار پرداخت";
      } else if (statusCode == 30) {
        return "در حال بررسی";
      } else if (statusCode == 35) {
        return "نقص مدارک ارسالی";
      } else if (statusCode == 40) {
        return "در دست صدور";
      } else if (statusCode == 10) {
        return "منتظر بررسی ادمین";
      } else if (statusCode == 50) {
        return "تکمیل شده";
      } else if (statusCode == 60) {
        return "ارسال شده";
      }
    },
    handleSubmit(data) {
      this.$store.dispatch("orders/changeStatus", data).then((result) => {
        // this.statusCode = result.status;
        console.log(result); // eslint-disable-next-line
        console.log("وضعیت سفارش تغییر کرد."); // eslint-disable-next-line
        this.showmodal = false;
      });
    },
    changeStatus() {
      const data = {
        orderId: Number(this.trackingCode),
        status: Number(this.statusCode),
      };
      console.log(data); // eslint-disable-line
      this.handleSubmit(data);
    },
    getImage(name, key) {
      setTimeout(() => {
        this.$store
          .dispatch("orders/downloadImageOrder", name)
          .then((result) => {
            if (key === "carCardImageFrontUrl") {
              this.carCardFront = result;
              console.log("عکس روی کارت ماشین یا برگ سبز دریافت شد!"); // eslint-disable-line
            } else if (key === "carCardImageBackUrl") {
              this.carCardBack = result;
              console.log("عکس پشت کارت ماشین یا برگ سبز دریافت شد!"); // eslint-disable-line
            } else if (key === "carLastInsImageUrl") {
              this.carLastIns = result;
              console.log("عکس بیمه نامه قبلی دریافت شد!"); // eslint-disable-line
            } else if (key === "govahinameImageUrl") {
              this.govahinameImage = result;
              console.log("عکس روی گواهینامه دریافت شد!"); // eslint-disable-line
            }
          })
          .catch((err) => {
            console.log("عکسی یافت نشد!"); // eslint-disable-line
            console.log(err); // eslint-disable-line
          });
      }, 500);
    },
  },
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items" />
    <b-modal
      id="modal-1"
      v-model="showmodal"
      title="تغییر وضعیت سفارش"
      header-close-variant="light"
      title-class="font-18"
      hide-footer
    >
      <form @submit.prevent="changeStatus">
        <div class="form-group">
          <label for="name">یکی از گزینه ها را انتخاب کنید:</label>
          <h5 class="mt-0 dis-grid">
            <div class="radio form-check-inline pt-2">
              <input
                type="radio"
                v-model="statusCode"
                id="inlineRadio1"
                value="10"
                name="radioInline"
                checked
              />
              <label for="inlineRadio1">در انتظار بررسی ادمین</label>
            </div>
            <div class="radio form-check-inline pt-2">
              <input
                v-model="statusCode"
                type="radio"
                id="inlineRadio2"
                value="30"
                name="radioInline"
                checked
              />
              <label for="inlineRadio2">در حال بررسی</label>
            </div>
            <div class="radio form-check-inline pt-2">
              <input
                v-model="statusCode"
                type="radio"
                id="inlineRadio3"
                value="35"
                name="radioInline"
              />
              <label for="inlineRadio3">نقص مدارک ارسالی</label>
            </div>
            <div class="radio form-check-inline pt-2">
              <input
                v-model="statusCode"
                type="radio"
                id="inlineRadio4"
                value="40"
                name="radioInline"
              />
              <label for="inlineRadio4">در دست صدور</label>
            </div>
            <div class="radio form-check-inline pt-2">
              <input
                v-model="statusCode"
                type="radio"
                id="inlineRadio5"
                value="50"
                name="radioInline"
              />
              <label for="inlineRadio5">تکمیل شده</label>
            </div>
            <div class="radio form-check-inline pt-2">
              <input
                v-model="statusCode"
                type="radio"
                id="inlineRadio6"
                value="60"
                name="radioInline"
              />
              <label for="inlineRadio6">ارسال شده</label>
            </div>
          </h5>
        </div>

        <div class="text-right">
          <button type="submit" class="btn btn-success">ثبت وضعیت</button>
          <!-- <b-button class="ml-1" variant="danger" @click="hideModal"
            >Cancel</b-button 
          >-->
        </div>
      </form>
    </b-modal>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header border-bottom bg-transparent">
            <h5 class="header-title mb-0">سفارش {{ insType }}</h5>
          </div>
          <div class="card-body">
            <div>
              <div class="row">
                <div class="col-lg-3 col-sm-6">
                  <div class="media mb-2">
                    <div class="mr-2 align-self-center">
                      <i class="ri-hashtag h2 m-0 text-muted"></i>
                    </div>
                    <div class="media-body">
                      <p class="mb-1">شماره سفارش.</p>
                      <h5 class="mt-0">
                        {{ trackingCode }}
                      </h5>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="media mb-2">
                    <div class="mr-2 align-self-center">
                      <i class="ri-user-2-line h2 m-0 text-muted"></i>
                    </div>
                    <div class="media-body">
                      <p class="mb-1">شماره مشتری</p>
                      <h5 class="mt-0">
                        {{ mobileNumber }}
                      </h5>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="media mb-2">
                    <div class="mr-2 align-self-center">
                      <i class="ri-calendar-event-line h2 m-0 text-muted"></i>
                    </div>
                    <div class="media-body">
                      <p class="mb-1">تاریخ و زمان خرید</p>
                      <h5 class="mt-0">
                        {{ createdDate }}
                        <small class="text-muted">{{ createdTime }}</small>
                      </h5>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="media mb-2">
                    <div class="mr-2 align-self-center">
                      <i class="ri-arrow-left-right-line h2 m-0 text-muted"></i>
                    </div>
                    <div class="media-body">
                      <a
                        class="btn text-white btn-danger"
                        href="javascript: void(0);"
                        @click="showmodal = true"
                      >
                        تغییر وضعیت
                      </a>
                      <p class="mb-1">
                        وضعیت:
                        {{ parseOrderStatus(this.statusCode) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <h4 class="header-title mb-3">جزئیات سفارش {{ insType }}</h4>
              <div class="row">
                <div class="col-lg-8">
                  <div>
                    <div class="table-responsive">
                      <table class="table border table-nowrap mb-lg-0">
                        <thead class="bg-light">
                          <tr>
                            <th>عنوان جزئیات</th>
                            <th>اطلاعات دریافتی</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">شرکت بیمه</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ company }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">کاربری خودرو</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ carTypeName }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">برند خودرو</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ carBrandName }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">مدل خودرو</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ carModelName }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">سال ساخت خودرو</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ carBuildYear }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">شرکت بیمه گر قبلی</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ previousCompany }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">تاریخ شروع بیمه نامه قبلی</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ lastPolicyStartDate }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">
                                    تاریخ پایان بیمه نامه قبلی
                                  </h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ lastPolicyExpDate }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>

                          <tr v-if="jarimeDirkard > 0">
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">جریمه دیرکرد</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">
                                    {{ jarimeDirkardDay }}روز (
                                    <vue-numeric
                                      :value="jarimeDirkard"
                                      separator=","
                                      read-only
                                    ></vue-numeric>
                                    تومان )
                                  </h5>
                                </div>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">تخفیف ثالث روی بیمه نامه</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ thirdPartyDiscount }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">تخفیف حوادث راننده</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">{{ driverDiscount }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">سابقه دریافت خسارت مالی</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">
                                    دریافت {{ financialDamage }}
                                  </h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">سابقه دریافت خسارت جانی</h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">دریافت {{ lifeDamage }}</h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">
                                    سابقه دریافت خسارت حوادث راننده
                                  </h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <h5 class="m-0">
                                    دریافت {{ havadesDamage }}
                                  </h5>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div class="col-lg-4">
                  <div>
                    <div class="table-responsive">
                      <table class="table border mb-0">
                        <thead class="bg-light">
                          <tr>
                            <th colspan="2">اطلاعات مالی</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">حق بیمه خالص</th>
                            <td>
                              <vue-numeric
                                :value="whithoutMaaliat"
                                separator=","
                                read-only
                              ></vue-numeric>
                              تومان
                            </td>
                          </tr>

                          <tr>
                            <th scope="row">تخفیف</th>
                            <td>
                              <vue-numeric
                                :value="discount"
                                separator=","
                                read-only
                              ></vue-numeric>
                              تومان
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">مالیات ارزش افزوده</th>
                            <td>
                              <vue-numeric
                                :value="maaliat"
                                separator=","
                                read-only
                              ></vue-numeric>
                              تومان
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">مبلغ نهایی</th>
                            <td>
                              <vue-numeric
                                :value="orderPrice"
                                separator=","
                                read-only
                              ></vue-numeric>
                              تومان
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="table-responsive">
                      <table class="table border mb-0">
                        <thead class="bg-light">
                          <tr>
                            <th colspan="2">اطلاعات دروازه پرداخت</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">پیگیری پرداخت</th>
                            <td>{{ transactionId }}</td>
                          </tr>
                          <tr>
                            <th scope="row">مبلغ پرداختی</th>
                            <td>
                              <vue-numeric
                                :value="amount"
                                separator=","
                                read-only
                              ></vue-numeric>
                              تومان
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">درگاه پرداخت</th>
                            <td>آی دی پی</td>
                          </tr>
                          <tr>
                            <th scope="row">تاریخ و زمان پرداخت</th>
                            <td>
                              {{ payCreatedDate }}
                              <small class="text-muted">{{
                                payCreatedTime
                              }}</small>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end card -->

        <div class="row mb-3">
          <div class="col-lg-4">
            <div>
              <h4 class="font-15 mb-2">مشخصات بیمه گذار</h4>

              <div class="card p-2 mb-lg-0">
                <table class="table table-borderless table-sm mb-0">
                  <tbody>
                    <tr>
                      <th scope="row">اسم کامل بیمه گذار</th>
                      <td>{{ fullName }}</td>
                    </tr>
                    <tr>
                      <th scope="row">شماره همراه</th>
                      <td>{{ mobileNumber }}</td>
                    </tr>
                    <tr>
                      <th scope="row">کدملی</th>
                      <td>{{ nationalCode }}</td>
                    </tr>
                    <tr>
                      <th scope="row">آدرس</th>
                      <td>{{ fullAddress }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div>
              <h4 class="font-15 mb-2">اطلاعات ارسال</h4>

              <div class="card p-2 mb-lg-0">
                <table class="table table-borderless table-sm mb-0">
                  <tbody>
                    <tr>
                      <th scope="row">استان</th>
                      <td>البرز</td>
                    </tr>
                    <tr>
                      <th scope="row">شهر</th>
                      <td>کرج</td>
                    </tr>
                    <tr>
                      <th scope="row">آدرس کامل</th>
                      <td></td>
                    </tr>
                    <tr>
                      <th scope="row">کدپستی</th>
                      <td>0987654321</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div>
              <h4 class="font-15 mb-2">مدارک دریافت شده</h4>

              <div class="card p-2 mb-lg-0">
                <div class="text-center">
                  <div v-if="!carCardFront">
                    <div class="my-2">
                      <i class="mdi mdi-image h1 text-muted"></i>
                    </div>
                    <h5><b>پوشه مدارک خالی</b></h5>
                  </div>
                  <div class="mt-2 pt-1">
                    <a
                      class="btn text-white btn-success"
                      href="javascript: void(0);"
                      @click="showmodalCardFront = true"
                    >
                      عکس روی کارت ماشین یا برگ سبز
                    </a>

                    <b-modal
                      id="CardFront"
                      v-model="showmodalCardFront"
                      title="عکس روی کارت ماشین یا برگ سبز"
                      header-close-variant="light"
                      title-class="font-18"
                      size="lg"
                      hide-footer
                    >
                      <img
                        width="100%"
                        :src="'data:image/jpeg;base64,' + carCardFront"
                      />
                    </b-modal>
                  </div>
                  <div class="mt-2 pt-1">
                    <a
                      class="btn text-white btn-success"
                      href="javascript: void(0);"
                      @click="showmodalCardBack = true"
                    >
                      عکس پشت کارت ماشین یا برگ سبز
                    </a>

                    <b-modal
                      id="CardFront"
                      v-model="showmodalCardBack"
                      title="عکس روی کارت ماشین یا برگ سبز"
                      header-close-variant="light"
                      title-class="font-18"
                      size="lg"
                      hide-footer
                    >
                      <img
                        width="100%"
                        :src="'data:image/jpeg;base64,' + carCardBack"
                      />
                    </b-modal>
                  </div>
                  <div class="mt-2 pt-1">
                    <a
                      class="btn text-white btn-success"
                      href="javascript: void(0);"
                      @click="showmodalPrevIns = true"
                    >
                      عکس بیمه نامه قبلی
                    </a>

                    <b-modal
                      id="CardFront"
                      v-model="showmodalPrevIns"
                      title="عکس بیمه نامه قبلی"
                      header-close-variant="light"
                      title-class="font-18"
                      size="lg"
                      hide-footer
                    >
                      <img
                        width="100%"
                        :src="'data:image/jpeg;base64,' + carLastIns"
                      />
                    </b-modal>
                  </div>
                  <div class="mt-2 pt-1">
                    <a
                      class="btn text-white btn-success"
                      href="javascript: void(0);"
                      @click="showmodalGovahiname = true"
                    >
                      عکس گواهینامه رانندگی
                    </a>

                    <b-modal
                      id="CardFront"
                      v-model="showmodalGovahiname"
                      title="عکس گواهینامه رانندگی"
                      header-close-variant="light"
                      title-class="font-18"
                      size="lg"
                      hide-footer
                    >
                      <img
                        width="100%"
                        :src="'data:image/jpeg;base64,' + govahinameImage"
                      />
                    </b-modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end row -->
  </div>
</template>
<style>
.dis-grid {
  display: grid !important;
}
</style>
