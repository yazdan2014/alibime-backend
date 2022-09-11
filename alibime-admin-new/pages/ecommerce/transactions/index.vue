<script>
import { mapGetters } from "vuex";
// import { ordersData } from "./data";
import moment from "moment-jalaali";
import VueNumeric from "vue-numeric";

/**
 * Orders component
 */
export default {
  head() {
    return {
      title: `داشبورد - ${this.title} | علی بیمه`
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
          text: "علی‌بیمه "
        },
        {
          text: "لیست سفارش ها"
        },
        {
          text: "سفارش ها",
          active: true
        }
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
          key: "transId",
          label: "پیگیری تراکنش"
        },
        {
          key: "orderId",
          label: "پیگیری محصول"
        },
        {
          key: "amount",
          label: "مبلغ تراکنش"
        },
        {
          key: "desc",
          label: "موضوع تراکنش"
        },
        {
          key: "createdDate",
          label: "تاریخ و زمان ثبت سفارش"
        },
        {
          key: "transState",
          label: "وضعیت سفارش"
        },
        {
          key: "action",
          label: "عملیات"
        }
      ]
    };
  },

  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      info: "auth/getInfo"
      // provinces: "getProvinces"
    }),
    rows() {
      // return this.ordersData.length;
    }
  },
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
    this.getOrders();
  },
  methods: {
    getOrders() {
      this.$store
        .dispatch("transactions/getAllTrans")
        .then(result => {
          const resultArray = result;
          for (let index = 0; index < result.length; index++) {
            const element = resultArray[index];
            const row = {
              orderId: String(element.orderId),
              transId: String(element.transactionId),
              amount: element.amount,
              desc: element.desc,
              createdDate: String(
                moment(element.createdDate).format("jYYYY/jM/jD")
              ),
              createdTime: String(
                moment(element.createdDate).format("HH:mm:ss")
              ),
              transState: String(this.parseTransStatus(element.status))
              // gateway: String(element.gateway)
            };
            // this.tableRows[row] = JSON.parse(JSON.stringify(row))
            this.ordersData.push(row);
            this.transactionId = String(element.transactionId);
          }
          console.log(this.ordersData);
        })
        .catch(error => {
          console.log(error); // eslint-disable-line
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
    },
    goTodetail(id) {
      this.$router.push({
        path: `/ecommerce/transactions/transaction-detail/?trans_id=${id}`
      });
      console.log(id);
    },
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  middleware: ["check-auth", "auth"]
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items" />
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
                      'badge-soft-danger': data.item.status === 'Payment Failed'
                    }"
                  >
                    {{ data.item.status }}</span
                  >
                </template>
                <template v-slot:cell(transId)="data">
                  {{ data.item.transId }}
                </template>
                <template v-slot:cell(orderId)="data">
                  {{ data.item.orderId }}
                </template>
                <template v-slot:cell(amount)="data">
                  <vue-numeric
                    :value="data.item.amount"
                    separator=","
                    read-only
                  ></vue-numeric>
                  تومان
                </template>
                <template v-slot:cell(desc)="data">
                  {{ data.item.desc }}
                </template>
                <template v-slot:cell()="data">
                  {{ data.item.createdDate }}
                  <small class="text-muted">{{ data.item.createdTime }}</small>
                </template>
                <template v-slot:cell(transState)="data">
                  <span
                    class="badge"
                    :class="{
                      'badge-warning': data.item.transState === 'پرداخت نشده',
                      'badge-success': data.item.transState === 'پرداخت شده',
                      'badge-danger': data.item.transState === 'کنسل شده'
                    }"
                  >
                    {{ data.item.transState }}</span
                  >
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
</style>
