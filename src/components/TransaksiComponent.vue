<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Transaksi </h3>

        <v-card>
            <v-card-title>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                @keydown.enter="readNamaPembeli(search)"
            ></v-text-field>
            <v-spacer></v-spacer>
              <v-btn color="success" dark @click="dialog = true">
                  Tambah
              </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="transaksis" :search="search" >
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editHandler(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon v-if="item.is_Deleted === 0" small class="mr-2" @click="deleteHandler(item.id)">
                        mdi-delete
                    </v-icon>
                    <v-icon v-else-if="item.is_Deleted === 1" small class="mr-2" @click="restoreHandler(item.id)">
                        mdi-restore
                    </v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                          v-model="form.nama_pembeli"
                          label="Nama Pembeli"
                          required>
                        </v-text-field>
                        <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="form.tanggal_stok"
                              label="Tanggal Masuk"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                              v-model="form.tanggal_stok"
                              @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                        <v-text-field
                          type="date"
                          v-model="form.tanggal_transaksi"
                          label="Tanggal Transaksi"
                          required>
                        </v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- <v-dialog v-model="dialogCetak" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Cetak Struk Transaksi</span>
                </v-card-title>
                <div>
                    <vue-html2pdf
                        :show-layout="false"
                        :float-layout="true"
                        :enable-download="true"
                        :preview-modal="true"
                        :paginate-elements-by-height="1400"
                        filename="hee hee"
                        :pdf-quality="2"
                        :manual-pagination="false"
                        pdf-format="a4"
                        pdf-orientation="landscape"
                        pdf-content-width="800px"

                        @progress="onProgress($event)"
                        @hasStartedGeneration="hasStartedGeneration()"
                        @hasGenerated="hasGenerated($event)"
                        ref="html2Pdf"
                    >
                        <section slot="pdf-content">
                            <table>
                                <tr>
                                    <td><img src=src/assets/logo.png></td>
                                    <td><h3>Atma Korean BBQ</h3>
                                        <br><h5> PLACE TO GRILL</h5>
                                        <br>Jl.Babarsari No. 43 Yogyakarta
                                        <br>552181
                                        <br>Telp. (0274) 487711
                                        <br>
                                    </td>
                                </tr>
                                <tr>
                                    <td>-------------------------------------</td>
                                </tr>
                                <tr>
                                    <td>Receipt # {{ 'AKB-' + 'ddMMyy' + 'id' }}</td>
                                    <td>Date {{  }}</td>
                                </tr>
                                <tr>
                                    <td>-------------------------------------</td>
                                </tr>
                                <tr>
                                    <td>Table</td>
                                </tr>

                            </table>
                        </section>
                    </vue-html2pdf>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                  <span class="headline">Warning!!!</span>
                </v-card-title>
                <v-card-text v-if="statusData === 'Hapus'">
                    Anda yakin ingin menghapus transaksi?
                </v-card-text>
                <v-card-text v-else-if="statusData === 'Restore'">
                    Anda yakin ingin memulihkan transaksi?
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cancel">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="reverseData">
                    Yes
                  </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{error_message}}
        </v-snackbar>
    </v-main>
</template>

<script>
export default {
  name: 'transaksi-component',
  data () {
    return {
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      search: null,
      menu: false,
      menu2: false,
      statusData: '',
      dialog: false,
      dialogConfirm: false,
      dialogTambah: false,
      headers: [
        {
          text: 'Nama Pembeli',
          align: 'start',
          sortable: true,
          value: 'nama_pembeli'
        },
        { text: 'Nama Pegawai', value: 'nama_pegawai' },
        { text: 'Tanggal Transaksi', value: 'tanggal_transaksi' },
        { text: 'Total Harga', value: 'total_harga' },
        { text: 'Actions', value: 'actions' }
      ],
      transaksi: new FormData(),
      transaksis: [],
      customers: [],
      pesanans: [],
      form: {
        nama_pembeli: '',
        nama_pegawai: '',
        tanggal_transaksi: '',
        total_harga: '',
        nama_menu: '',
        jumlah_menu: ''
      },
      deleteId: '',
      restoreId: '',
      editId: '',
      mejaId: ''
    }
  },
  methods: {
    setForm () {
      if (this.inputType === 'Tambah') {
        this.save()
      } else {
        this.update()
      }
    },
    reverseData () {
      if (this.statusData === 'Restore') {
        this.restoreData()
      } else {
        this.deleteData()
      }
    },
    // read data transaksi
    readData () {
      const url = this.$api + '/transaksi'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.transaksis = response.data.data
      })
    },
    // read data pesanan
    readDataPesanan () {
      const url = this.$api + '/pesanan'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.pesanans = response.data.data
      })
    },
    // read data customer
    readDataCustomer () {
      const url = this.$api + '/customer'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.customers = response.data.data
      })
    },
    readNamaPembeli (searchName) {
      const url = this.$api + '/transaksiByName/' + searchName
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.menus = response.data.data
      })
    },
    // get tanggal hari ini
    getToday () {
      const today = new Date()
      const tanggal = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const waktu = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()

      const tanggalwaktu = tanggal + '   ' + waktu
      return tanggalwaktu
    },

    // simpan data transaksi
    // save() {
    //     this.transaksi.append('id_meja', this.form.id_meja);
    //     this.transaksi.append('id_customer', this.form.id_customer);
    //     this.transaksi.append('status_transaksi', this.form.status_transaksi);
    //     this.transaksi.append('tanggal_transaksi', this.form.tanggal_transaksi);
    //     this.transaksi.append('sesi', this.form.sesi);

    //     var url = this.$api + '/transaksi'
    //     this.load = true
    //     this.$http.post(url, this.transaksi, {
    //         headers: {
    //             'Authorization': 'Bearer ' + localStorage.getItem('token')
    //         }
    //     }).then(response => {
    //         this.error_message=response.data.message;
    //         this.color="green"
    //         this.snackbar=true;
    //         this.load = false;
    //         this.close();
    //         this.resetForm();
    //     }).catch(error => {
    //         this.error_message=error.response.data.message;
    //         this.color="red"
    //         this.snackbar=true;
    //         this.load = false;
    //     }).finally(()=> {
    //         this.transaksis = [];
    //         this.readData();
    //         this.readDataMeja();
    //     })
    // },

    // ubah data transaksi
    update () {
      const newData = {
        tanggal_transaksi: this.form.tanggal_transaksi
      }
      const url = this.$api + 'up/transaksi/' + this.editId
      this.load = true
      this.$http.put(url, newData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      }).finally(() => {
        this.transaksis = []
        this.readData()
        this.readDataMeja()
      })
    },
    // soft delete data transaksi
    deleteData () {
      const url = this.$api + '/transaksi/softDelete/' + this.deleteId
      this.load = true
      this.$http.put(url, null, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    editHandler (item) {
      this.inputType = 'Ubah'
      this.editId = item.id
      this.form.nama_pembeli = item.nama_pembeli
      this.form.nama_pegawai = item.nama_pegawai
      this.form.tanggal_transaksi = item.tanggal_transaksi
      this.form.total_harga = item.total_harga
      this.form.nama_menu = item.nama_menu
      this.form.jumlah_menu = item.jumlah_menu
      this.dialog = true
    },
    deleteHandler (id) {
      this.deleteId = id
      this.dialogConfirm = true
      this.statusData = 'Hapus'
    },
    restoreHandler (id) {
      this.restoreId = id
      this.dialogConfirm = true
      this.statusData = 'Restore'
    },
    close () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.inputType = 'Tambah'
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.inputType = 'Tambah'
    },
    resetForm () {
      this.form = {
        tanggal_transaksi: null
      }
    }
  },
  computed: {
    formTitle () {
      return this.inputType
    }
  },
  mounted () {
    this.readData()
    this.readDataCustomer()
    this.readDataPesanan()
  }
}
</script>
