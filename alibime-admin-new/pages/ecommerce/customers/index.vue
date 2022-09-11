<script>
import { mapGetters } from "vuex";
import moment from "moment-jalaali";
import VueNumeric from "vue-numeric";

/**
 * Orders component
 */
export default {
  head() {
    return {
      title: `داشبورد - ${this.title} | علی بیمه`,
    };
  },
  components: { VueNumeric },
  data() {
    return {
      transactionId: null,
      ordersData: [],
      title: "سفارش ها",
      items: [
        {
          text: "علی‌بیمه ",
        },
        {
          text: "لیست سفارش ها",
        },
        {
          text: "سفارش ها",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "createdDate",
      sortDesc: true,
      fields: [
        {
          key: "mobilePhone",
          label: "کد کاربری",
        },
        {
          key: "fullName",
          label: "نام و نام خانوادگی",
        },
        {
          key: "nationalCode",
          label: "کدملی",
        },
        {
          key: "orderCount",
          label: "تعداد سفارش ها",
        },
        {
          key: "createdDate",
          label: "تاریخ و زمان ثبت نام",
        },
        {
          key: "amount",
          label: "موجودی حساب",
        },
        {
          key: "action",
          label: "عملیات",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      info: "auth/getInfo",
      // provinces: "getProvinces"
    }),
    rows() {
      // return this.ordersData.length;
    },
  },
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
    this.getOrders();
  },
  methods: {
    getOrders() {
      this.$store
        .dispatch("users/getUsers")
        .then((result) => {
          const resultArray = result;
          for (let index = 0; index < result.length; index++) {
            const element = resultArray[index];
            const row = {
              mobilePhone: element.mobilePhone,
              fullName: element.firstName + " " + element.lastName,
              nationalCode: element.nationalCode,
              orderCount: element.orderCount,
              createdDate: String(
                moment(element.createdDate).format("jYYYY/jM/jD")
              ),
              amount: element.amount,
            };
            // this.tableRows[row] = JSON.parse(JSON.stringify(row))
            this.ordersData.push(row);
          }
          console.log(this.ordersData);
        })
        .catch((error) => {
          console.log(error); // eslint-disable-line
        });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  middleware: ["check-auth", "auth"],
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items" />
    <div v-if="info.role === 'superAdmin' || info.role === 'powerAdmin'">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row mb-2"></div>
              <div class="row mb-2">
                <div class="col-sm-12 col-md-6">
                  <div id="tickets-table_length" class="dataTables_length">
                    <label class="d-inline-flex align-items-center">
                      نمایش&nbsp;
                      <b-form-select
                        v-model="perPage"
                        size="sm"
                        :options="pageOptions"
                      ></b-form-select
                      >&nbsp;سفارش‌ها
                    </label>
                  </div>
                </div>
                <!-- Search -->
                <div class="col-sm-12 col-md-6">
                  <div
                    id="tickets-table_filter"
                    class="dataTables_filter text-md-right"
                  >
                    <label class="d-inline-flex align-items-center">
                      جستجو:
                      <b-form-input
                        v-model="filter"
                        type="search"
                        placeholder="جستجو..."
                        class="form-control form-control-sm ml-2"
                      ></b-form-input>
                    </label>
                  </div>
                </div>
                <!-- End search -->
              </div>
              <!-- Table -->
              <div class="table-responsive mb-0">
                <b-table
                  table-class="table table-centered w-100"
                  thead-tr-class="bg-light"
                  :items="ordersData"
                  :fields="fields"
                  responsive="sm"
                  :per-page="perPage"
                  :current-page="currentPage"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  @filtered="onFiltered"
                >
                  <!-- <template v-slot:cell(check)="data">
                  <div class="custom-control custom-checkbox text-center">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      :id="`contacusercheck${data.item.id}`"
                    />
                    <label
                      class="custom-control-label"
                      :for="`contacusercheck${data.item.id}`"
                    ></label>
                  </div>
                </template> -->

                  <template v-slot:cell(mobilePhone)="data">
                    {{ data.item.mobilePhone }}
                  </template>
                  <template v-slot:cell(fullName)="data">
                    {{ data.item.fullName }}
                  </template>

                  <template v-slot:cell(nationalCode)="data">
                    {{ data.item.nationalCode }}
                  </template>
                  <template v-slot:cell()="data">
                    {{ data.item.createdDate }}
                    <small class="text-muted">{{
                      data.item.createdTime
                    }}</small>
                  </template>
                  <template v-slot:cell(amount)="data">
                    {{ data.item.amount }}
                  </template>
                  <template v-slot:cell(action)="data">
                    <ul class="list-inline table-action m-0">
                      <li class="list-inline-item">
                        <i
                          class="mdi mdi-eye"
                          @click="goTodetail(data.item.transId)"
                        ></i>
                      </li>
                      <!-- <li class="list-inline-item">
                      <a href="javascript:void(0);" class="action-icon">
                        <i class="mdi mdi-square-edit-outline"></i
                      ></a>
                    </li> -->
                      <li class="list-inline-item">
                        <a href="javascript:void(0);" class="action-icon">
                          <i class="mdi mdi-delete"></i
                        ></a>
                      </li>
                    </ul>
                  </template>
                </b-table>
              </div>
              <div class="row">
                <div class="col">
                  <div
                    class="
                      dataTables_paginate
                      paging_simple_numbers
                      float-right
                    "
                  >
                    <ul class="pagination pagination-rounded">
                      <!-- pagination -->
                      <b-pagination
                        v-model="currentPage"
                        :total-rows="rows"
                        :per-page="perPage"
                      ></b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="col-md-8 col-lg-6 col-xl-5 mx-auto">
        <div class="card">
          <div class="card-body p-4">
            <div class="error-ghost text-center">
              <img
                src="~/assets/images/error.svg"
                width="200"
                alt="error-image"
              />
            </div>

            <div class="text-center">
              <h3 class="mt-4 text-uppercase font-weight-bold">
                شما دسترسی به این صفحه ندارید!
              </h3>
              <p class="text-muted mb-0 mt-3" style="line-height: 20px">
                همکار گرامی این صفحه محافظت شده است و مدیران اصلی فقط دسترسی
                دیدن این صفحه را دارند! چنانچه شماهم از مدیران اصلی علی‌بیمه
                هستین اما این صفحه را مشاهده نمیکنید لطفا با واحد فنی علی بیمه
                تماس بگیرید. با تشکر مدیر فنی
              </p>

              <nuxt-link to="/" class="btn btn-primary mt-3"
                ><i class="mdi mdi-reply mr-1"></i> رفتن به داشبورد</nuxt-link
              >
            </div>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </div>
    </div>
  </div>
</template>
<style scoped>
.orderName td {
  font-weight: 600;
}
</style>
