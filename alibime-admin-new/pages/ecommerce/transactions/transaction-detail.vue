<script>
import moment from "moment-jalaali";
import VueNumeric from "vue-numeric";
export default {
  head() {
    return {
      title: `داشبورد - ${this.title} | علی بیمه`
    };
  },
  components: {
    VueNumeric
  },
  data() {
    return {
      title: "جزئیات فاکتور",
      items: [
        {
          text: "alibime"
        },
        {
          text: "eCommerce"
        },
        {
          text: "Order Detail",
          active: true
        }
      ],
      trackingCode: 0,
      mobileNumber: 0,
      orderPrice: null,
      status: 0,
      discount: 0,
      maaliat: 0,
      whithoutMaaliat: 0,
      coversPrice: 0,
      transactionId: 0,
      amount: 0,
      payCreatedDate: null,
      payCreatedTime: null,
      createdDate: null,
      createdTime: null,

      transId: 0,

      statusCode: null
    };
  },
  middleware: ["check-auth", "auth"],
  mounted() {
    this.transId = this.$route.query.trans_id;
    this.getTransactionData(this.transId);
  },
  methods: {
    coverSelected() {
      if (this.coverChemical) {
      }
    },
    getOrderData(id) {
      this.$store.dispatch("orders/getOrderbyTrackID", id).then(result => {
        console.log(result, "order get by id done."); // eslint-disable-line
        this.trackingCode = result.tracking_code;
        this.mobileNumber = result.mobileNumber;
        this.createdDate = moment(result.createdDate).format("jYYYY/jM/jD");
        this.createdTime = moment(result.createdDate).format("HH:mm:ss");
        this.whithoutMaaliat = result.whithoutMaaliat;
        this.coversPrice = result.coversPrice;
        this.maaliat = result.maaliat;
        this.orderPrice = result.orderPrice;
      });
    },
    getTransactionData(id) {
      console.log(id); // eslint-disable-line
      this.$store
        .dispatch("transactions/getTransbyTransID", id)
        .then(result => {
          console.log(result, "Transaction get by id done."); // eslint-disable-line
          this.transactionId = result.transactionId;
          this.status = this.parseTransStatus(result.status);
          this.amount = result.amount;
          this.payCreatedDate = moment(result.createdDate).format(
            "jYYYY/jM/jD"
          );
          this.payCreatedTime = moment(result.createdDate).format("HH:mm:ss");
          this.orderId = result.orderId;
          this.getOrderData(this.orderId);
        });
    },
    parseTransStatus(statusCode) {
      if (statusCode == 10) {
        return "پرداخت شده";
      } else if (statusCode == 20) {
        return "پرداخت نشده";
      } else if (statusCode == 99) {
        return "پرداخت نشده";
      }
    }
  }
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header border-bottom bg-transparent">
            <h5 class="header-title mb-0">جزئیات فاکتور</h5>
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
                      <p class="mb-1">شماره فاکتور</p>
                      <h5 class="mt-0">
                        {{ transactionId }}
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
                      <p class="mb-1">وضعیت:</p>
                      <h5 class="mt-0">
                        {{ status }}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <h4 class="header-title mb-3">جزئیات سفارش {{ insType }}</h4>
              <div class="row">
                <div class="col-lg-6">
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
                          <th scope="row">پوشش های اضافی</th>
                          <td>
                            <vue-numeric
                              :value="coversPrice"
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
                </div>
                <div class="col-lg-6">
                  <div class="table-responsive">
                    <table class="table border mb-0">
                      <thead class="bg-light">
                        <tr>
                          <th colspan="2">اطلاعات پرداختی</th>
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
        <!-- end card -->

        <!-- <div class="row mb-3">
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
              <h4 class="font-15 mb-2">مدارک ارسالی</h4>

              <div class="card p-2 mb-lg-0">
                <div class="text-center">
                  <div class="my-2">
                    <i class="mdi mdi-image h1 text-muted"></i>
                  </div>
                  <h5><b>پوشه مدارک خالی</b></h5>
                  <div class="mt-2 pt-1">
                    <p class="mb-1">
                      <span class="font-weight-semibold">Order ID :</span>
                      xxxx048
                    </p>
                    <p class="mb-0">
                      <span class="font-weight-semibold">Payment Mode :</span>
                      COD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
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
