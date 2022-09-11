<script>
import { mapGetters } from "vuex";
// import { ordersData } from "./data";
import moment from "moment-jalaali";

/**
 * Orders component
 */
export default {
  head() {
    return {
      title: `داشبورد - ${this.title} | علی بیمه`,
    };
  },
  data() {
    return {
      ordersData: [],
      title: "سفارش ها",
      items: [
        {
          text: "علی‌بیمه  ",
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
      loading: false,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "createdDate",
      sortDesc: true,
      showDeleteModal: false,
      showNotAccess: false,
      orderId: null,
      fields: [
        {
          key: "trackCode",
          label: "شماره سفارش",
        },
        {
          key: "orderName",
          label: "نوع سفارش",
        },
        {
          key: "companyName",
          label: "نمایندگی",
        },
        {
          key: "createdDate",
          label: "تاریخ و زمان ثبت سفارش",
        },
        {
          key: "orderState",
          label: "وضعیت سفارش",
        },
        {
          key: "actions",
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
      this.loading = true;
      this.$store
        .dispatch("orders/getAllOrders")
        .then((result) => {
          const resultArray = result;
          for (let index = 0; index < result.length; index++) {
            const element = resultArray[index];
            const row = {
              trackCode: String(element.tracking_code),
              orderName: element.insType,
              companyName: element.company,
              createdDate: String(
                moment(element.createdDate).format("jYYYY/jM/jD")
              ),
              createdTime: String(
                moment(element.createdDate).format("HH:mm:ss")
              ),
              orderState: String(this.parseOrderStatus(element.status)),
              actions: element._id,
            };
            // this.tableRows[row] = JSON.parse(JSON.stringify(row))
            this.ordersData.push(row);
          }
          console.log(this.ordersData); // eslint-disable-line
          this.loading = false;
        })
        .catch((error) => {
          console.log(error); // eslint-disable-line
        });
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
    goTodetail(id) {
      this.$router.push({
        path: `/ecommerce/order-detail/?order_id=${id}`,
      });
      console.log(id);
    },
    deleteModal() {
      this.showDeleteModal = true;
    },
    hideModal() {
      this.showDeleteModal = false;
    },
    deleteOrder(id) {
      this.$store
        .dispatch("orders/deleteOrder", id)
        .then((result) => {
          console.log(result); // eslint-disable-next-line
          console.log("سفارش با موفقیت حذف شد!"); // eslint-disable-next-line
          this.showDeleteModal = false;
        })
        .catch((error) => {
          console.log("error is:" + error); // eslint-disable-line
          this.showDeleteModal = false;
          this.showNotAccess = true;
        });
    },

    /**
     * Search the table data with search input
     */
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
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="text-center">
              <div class="row">
                <div class="col-md-6 col-xl-3">
                  <div class="py-1">
                    <i class="fe-tag font-24"></i>
                    <h3>0</h3>
                    <p class="text-uppercase mb-1 font-13 font-weight-medium">
                      تعداد کل سفارش ها
                    </p>
                  </div>
                </div>
                <div class="col-md-6 col-xl-3">
                  <div class="py-1">
                    <i class="fe-archive font-24"></i>
                    <h3 class="text-warning">0</h3>
                    <p class="text-uppercase mb-1 font-13 font-weight-medium">
                      سفارش های صادر شده
                    </p>
                  </div>
                </div>
                <div class="col-md-6 col-xl-3">
                  <div class="py-1">
                    <i class="fe-shield font-24"></i>
                    <h3 class="text-success">0</h3>
                    <p class="text-uppercase mb-1 font-13 font-weight-medium">
                      سفارش های در حال صدور
                    </p>
                  </div>
                </div>
                <div class="col-md-6 col-xl-3">
                  <div class="py-1">
                    <i class="fe-delete font-24"></i>
                    <h3 class="text-danger">0</h3>
                    <p class="text-uppercase mb-1 font-13 font-weight-medium">
                      سفارش های ناقص
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <!-- <div class="col-sm-6">
                <nuxt-link
                  to="/ecommerce/product-create"
                  class="btn btn-danger mb-2"
                  ><i class="mdi mdi-plus-circle mr-1"></i> Add
                  Products</nuxt-link
                >
              </div>
              <div class="col-sm-6">
                <div class="float-sm-right">
                  <button type="button" class="btn btn-success mb-2 mb-sm-0">
                    <i class="mdi mdi-cog"></i>
                  </button>
                </div>
              </div> -->
              <!-- end col-->
            </div>
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
              <div v-if="loading === true" class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
              <b-table
                v-if="loading === false"
                table-class="table table-centered w-100"
                thead-tr-class="bg-light"
                :items="ordersData"
                :fields="fields"
                :hover="true"
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

                <template v-slot:cell(id)="data">
                  <nuxt-link
                    to="/ecommerce/order-detail"
                    class="text-body font-weight-medium"
                    >{{ data.item.id }}</nuxt-link
                  >
                </template>
                <template v-slot:cell(status)="data">
                  <span
                    class="badge badge-soft-success"
                    :class="{
                      'badge-soft-warning':
                        data.item.status === 'Awaiting Authorization',
                      'badge-soft-danger':
                        data.item.status === 'Payment Failed',
                    }"
                  >
                    {{ data.item.status }}</span
                  >
                </template>
                <template v-slot:cell(trackCode)="data">
                  {{ data.item.trackCode }}
                </template>
                <template v-slot:cell(orderName)="data" class="orderName">
                  {{ data.item.orderName }}
                </template>
                <template v-slot:cell(companyName)="data">
                  {{ data.item.companyName }}
                </template>
                <template v-slot:cell()="data">
                  {{ data.item.createdDate }}
                  <small class="text-muted">{{ data.item.createdTime }}</small>
                </template>
                <template v-slot:cell(orderState)="data">
                  <span
                    class="badge"
                    :class="{
                      'badge-warning':
                        data.item.orderState === 'در انتظار پرداخت',
                      'badge-success': data.item.orderState === 'صادر شده',
                      'badge-success': data.item.orderState === 'پرداخت شده',
                      'badge-info': data.item.orderState === 'تحویل داده شده',
                      'badge-info':
                        data.item.orderState === 'منتظر بررسی ادمین',
                      'badge-danger': data.item.orderState === 'کنسل شده',
                    }"
                  >
                    {{ data.item.orderState }}</span
                  >
                </template>
                <template v-slot:cell(actions)="data">
                  <ul class="list-inline table-action m-0">
                    <!-- <li class="list-inline-item">
                      <a href="javascript:void(0);" class="action-icon">
                        <i class="mdi mdi-eye"></i
                      ></a>
                    </li> -->
                    <li
                      class="list-inline-item title-edit action-icon"
                      @click="goTodetail(data.item.actions)"
                    >
                      <i class="mdi mdi-square-edit-outline"></i>
                      <span class="title">ویرایش</span>
                    </li>
                    <li
                      class="list-inline-item title-edit"
                      @click="deleteModal(data.item.actions)"
                    >
                      <a href="javascript:void(0);" class="action-icon">
                        <i class="mdi mdi-delete"></i
                      ></a>
                    </li>
                    <b-modal
                      id="CardFront"
                      v-model="showDeleteModal"
                      title="حذف سفارش"
                      header-close-variant="light"
                      title-class="font-18"
                      size="md"
                      hide-footer
                    >
                      <form @submit.prevent="deleteOrder(data.item.trackCode)">
                        <div class="form-group">
                          <label for="name"
                            >یکی از گزینه ها را انتخاب کنید:</label
                          >

                          <div class="text-right">
                            <button type="submit" class="btn btn-success">
                              حذف سفارش
                            </button>
                            <b-button
                              class="ml-1"
                              variant="danger"
                              @click="hideModal"
                              >پشیمون شدم!</b-button
                            >
                          </div>
                        </div>
                      </form></b-modal
                    >
                    <b-modal
                      id="CardFront"
                      v-model="showNotAccess"
                      title="حذف سفارش"
                      header-close-variant="light"
                      title-class="font-18"
                      size="lg"
                      hide-footer
                      hide-header
                    >
                      <h2>شما دسترسی لازم برای حذف سفارش را ندارید!</h2>
                    </b-modal>
                  </ul>
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div
                  class="dataTables_paginate paging_simple_numbers float-right"
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
</template>
<style scoped>
.orderName td {
  font-weight: 600;
}
.title-edit {
  font-size: 14px;
}
</style>
