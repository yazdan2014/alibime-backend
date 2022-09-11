<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
import Users from "./users";
import Sources from "./sources";
import Channels from "./channels";
import SocialMedia from "./social-media";
import Overview from "./overview";

/**
 * Analytics component
 */
export default {
  head() {
    return {
      title: `داشبورد - ${this.title} | علی بیمه`,
    };
  },
  components: {
    Users,
    Sources,
    Channels,
    SocialMedia,
    Overview,
    apexchart: () => import("vue-apexcharts"),
  },
  data() {
    return {
      title: "آمارگیری",
      items: [
        {
          text: "علی بیمه",
        },
        {
          text: "داشبورد",
        },
        {
          text: "آمارگیری",
          active: true,
        },
      ],
      series: [
        {
          name: "بازدید یونیک",
          data: [10, 10, 10, 10, 12, 13, 14],
        },
        {
          name: "بازدید صفحات",
          data: [14, 15, 0, 16, 18, 25, 41],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        colors: ["#08BCC0", "#f7b84b"],
        xaxis: {
          type: "datetime",
          categories: [
            "2018-09-19T00:00:00.000Z",
            "2018-09-19T01:30:00.000Z",
            "2018-09-19T02:30:00.000Z",
            "2018-09-19T03:30:00.000Z",
            "2018-09-19T04:30:00.000Z",
            "2018-09-19T05:30:00.000Z",
            "2018-09-19T06:30:00.000Z",
          ],
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
      trans24: 0,
      orders24: 0,
      ticks24: 0,
      accs24: 0,
    };
  },
  middleware: ["check-auth", "auth"],
  fetchOnServer: false,
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      info: "auth/getInfo",
      // provinces: "getProvinces"
    }),
  },
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
    this.get24Trans();
    this.get24Orders();
    this.get24Acc();
    this.get24Ticks();
  },
  methods: {
    get24Trans() {
      this.$store.dispatch("dashboard/get24Transactions").then((result) => {
        this.trans24 = result.counter;
      });
    },
    get24Orders() {
      this.$store.dispatch("dashboard/get24Orders").then((result) => {
        this.orders24 = result.counter;
      });
    },
    get24Acc() {
      this.$store.dispatch("dashboard/get24Accounts").then((result) => {
        this.accs24 = result.counter;
      });
    },
    get24Ticks() {
      this.$store.dispatch("dashboard/get24Tickets").then((result) => {
        this.ticks24 = result.counter;
      });
    },
  },
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="text-center">
          <div class="row">
            <div class="col-md-6 col-xl-3">
              <div class="card">
                <div class="card-body">
                  <i
                    class="fa fa-info-circle text-muted float-right"
                    v-b-tooltip.hover
                    title="تعداد مشتری‌های جدید ثبت نام شده در ۲۴ساعت گذشته"
                  ></i>
                  <h4 class="m-0 font-16">مشتری جدید</h4>
                  <h2 class="my-3 text-center" id="active-users-count">
                    {{ accs24 }}
                  </h2>
                  <p class="text-muted m-0">
                    مشتری‌های جدید دیروز: {{ accs24 }}
                    <span class="float-right">
                      <i class="mdi mdi-arrow-up-bold mr-1 text-success"></i>0%
                    </span>
                  </p>
                </div>
                <!-- end card-body-->
              </div>
              <!--end card-->
            </div>
            <div class="col-md-6 col-xl-3">
              <div class="card">
                <div class="card-body">
                  <i
                    class="fa fa-info-circle text-muted float-right"
                    v-b-tooltip.hover
                    title="تعداد تیکت های ثبت شده در ۲۴ساعت گذشته"
                  ></i>
                  <h4 class="m-0 font-16">تیکت ها</h4>
                  <h2 class="my-3 text-center" id="active-users-count">
                    {{ accs24 }}
                  </h2>
                  <p class="text-muted m-0">
                    تعداد تیکت های دیروز: {{ accs24 }}
                    <span class="float-right">
                      <i class="mdi mdi-arrow-up-bold mr-1 text-success"></i>0%
                    </span>
                  </p>
                </div>
                <!-- end card-body-->
              </div>
              <!--end card-->
            </div>
            <div class="col-md-6 col-xl-3">
              <div class="card">
                <div class="card-body">
                  <i
                    class="fa fa-info-circle text-muted float-right"
                    v-b-tooltip.hover
                    title="تعداد سفارش‌های جدید ثبت شده در ۲۴ساعت گذشته"
                  ></i>
                  <h4 class="m-0 font-16">سفارش ها</h4>
                  <h2 class="my-3 text-center" id="active-users-count">
                    {{ orders24 }}
                  </h2>
                  <p class="text-muted m-0">
                    تعداد سفارش‌های دیروز: {{ orders24 }}
                    <span class="float-right">
                      <i class="mdi mdi-arrow-up-bold mr-1 text-success"></i>1%
                    </span>
                  </p>
                </div>
                <!-- end card-body-->
              </div>
              <!--end card-->
            </div>
            <div class="col-md-6 col-xl-3">
              <div class="card">
                <div class="card-body">
                  <i
                    class="fa fa-info-circle text-muted float-right"
                    v-b-tooltip.hover
                    title="تعداد تراکنش‌های ثبت شده در 24ساعت گذشته"
                  ></i>
                  <h4 class="m-0 font-16">تراکنش ها</h4>
                  <h2 class="my-3 text-center" id="active-users-count">
                    {{ trans24 }}
                  </h2>
                  <p class="text-muted m-0">
                    تعداد تراکنش های دیروز: {{ trans24 }}
                    <span class="float-right">
                      <i class="mdi mdi-arrow-up-bold mr-1 text-success"></i>1%
                    </span>
                  </p>
                </div>
                <!-- end card-body-->
              </div>
              <!--end card-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <!-- <div class="col-xl-3 col-lg-4">
        <b-alert show dismissible class="mb-3"
          >Property MN7xx is not receiving hits. Either your site is not
          receiving any sessions.</b-alert
        >
      </div> -->
      <!-- end col -->

      <div class="col-xl-12 col-lg-12">
        <div class="card">
          <div class="card-body">
            <ul class="nav float-right d-none d-lg-flex">
              <li class="nav-item">
                <a class="nav-link text-muted" href="#">امروز</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-muted" href="#">۷روز</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">۱۵روز</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-muted" href="#">۱ ماه</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-muted" href="#">۳ ماه</a>
              </li>
            </ul>
            <h4 class="header-title mb-3">بررسی بازدید سایت</h4>

            <div class="row align-items-center">
              <div class="col-xl-8">
                <apexchart
                  type="area"
                  height="350"
                  :options="chartOptions"
                  :series="series"
                ></apexchart>
              </div>
              <!-- end col -->
              <div class="col-xl-4">
                <h5 class="mb-1 mt-0">
                  1234
                  <small class="text-muted ml-2">بیمه شخص ثالث</small>
                </h5>
                <div class="row align-items-center no-gutters mb-2 pb-1">
                  <div class="col">
                    <div class="progress progress-sm">
                      <div
                        class="progress-bar"
                        role="progressbar"
                        style="width: 5%"
                        aria-valuenow="5"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="font-weight-medium ml-2">5%</div>
                  </div>
                </div>

                <h5 class="mb-1 mt-0">
                  0
                  <small class="text-muted ml-2">بیمه بدنه</small>
                </h5>
                <div class="row align-items-center no-gutters mb-2 pb-1">
                  <div class="col">
                    <div class="progress progress-sm">
                      <div
                        class="progress-bar bg-success"
                        role="progressbar"
                        style="width: 0%"
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="font-weight-medium ml-2">0%</div>
                  </div>
                </div>

                <h5 class="mb-1 mt-0">
                  0
                  <small class="text-muted ml-2">بیمه آتش سوزی</small>
                </h5>
                <div class="row align-items-center no-gutters mb-2 pb-1">
                  <div class="col">
                    <div class="progress progress-sm">
                      <div
                        class="progress-bar bg-warning"
                        role="progressbar"
                        style="width: 0%"
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="font-weight-medium ml-2">0%</div>
                  </div>
                </div>

                <h5 class="mb-1 mt-0">
                  0
                  <small class="text-muted ml-2">بیمه عمر</small>
                </h5>
                <div class="row align-items-center no-gutters mb-2 pb-1">
                  <div class="col">
                    <div class="progress progress-sm">
                      <div
                        class="progress-bar"
                        role="progressbar"
                        style="width: 0%"
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="font-weight-medium ml-2">0%</div>
                  </div>
                </div>

                <h5 class="mb-1 mt-0">
                  0
                  <small class="text-muted ml-2">بیمه موتور سیکلت</small>
                </h5>
                <div class="row align-items-center no-gutters">
                  <div class="col">
                    <div class="progress progress-sm">
                      <div
                        class="progress-bar bg-danger"
                        role="progressbar"
                        style="width: 0%"
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="font-weight-medium ml-2">0%</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end row -->
          </div>
          <!-- end card-body-->
        </div>
        <!-- end card-->
      </div>
      <!-- end col-->
    </div>
    <!-- end row-->
    <!-- <div class="row">
      <div class="col-lg-6">
        <Users />
      </div>
      <div class="col-lg-6">
        <Sources />
      </div>
    </div> -->
    <!-- end row -->
    <!-- <div class="row">
      <div class="col-xl-4 col-lg-6">
        <Channels />
      </div>
      <div class="col-xl-4 col-lg-6">
        <SocialMedia />
      </div>
      <div class="col-xl-4 col-lg-6">
        <Overview />
      </div>
    </div> -->
  </div>
</template>

<style>
.title-edit {
  cursor: pointer;
}
</style>
