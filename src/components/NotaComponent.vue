<template>
    <v-main class="list">
        <h3 class="text-h3 d-flex font-weight-medium ma-5 justify-center"> SIKafe </h3>
          <v-flex v-for="item in cart" :key="item.id">
            <v-card
            class="text-xs ma-4 cards"
            elevation="0"
            outlined>
            <div class="row">
                <div class="col-3">
                <v-img
                    :src='showPic(item)'
                    class="fotoMenu"
                />
                </div>
                <div class="col-3 d-flex ma-auto pa-auto">
                <v-list-item-content class="pa-2">
                    <v-list-item-title>
                    <b>{{ item.nama_menu }}</b><br/><br/>
                    <b> Rp.{{ item.harga_menu }}</b>
                    </v-list-item-title>
                </v-list-item-content>
                </div>
                <div class="col-2 d-flex ma-auto pa-auto">
                <v-list-item-subtitle>
                    <v-col class="col d-flex justify-center align-text-center mt-4">
                    <b>Jumlah :</b>
                    </v-col>
                    <v-col class="col d-flex justify-center align-text-center mb-5">
                    x {{ item.jumlah_menu }}
                    </v-col>
                </v-list-item-subtitle>
                </div>
                <div class="col-4 d-flex ma-auto pa-auto">
                <v-list-item-subtitle>
                    <div class="row">
                    <v-col class="col">
                        <v-btn class="ml-4" @click="editHandler(item)">
                        Edit
                        </v-btn>
                    </v-col>
                    <v-col class="col">
                        <v-icon medium :color="'red'" class="mr-2 ml-2" @click="deleteHandler()">
                        mdi-delete
                        </v-icon>
                    </v-col>
                    </div>
                </v-list-item-subtitle>
                </div>
            </div>
            </v-card>
          </v-flex>
        <br/>
        <v-card-subtitle><b>Subtotal : {{ this.subtotal }}</b></v-card-subtitle>
        <v-card-subtitle><b>Tax : {{ this.tax }}</b></v-card-subtitle>
        <v-card-subtitle><b>Total Harga : {{ this.totalHarga }}</b></v-card-subtitle>
        <div class="align-end pb-8">
          <v-btn @click="goPesanMenu()">Kembali ke Menu Utama</v-btn>
        </div>
    </v-main>
</template>

<script>
export default {
  name: 'nota-component',
  data () {
    return {
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      statusData: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogTambah: false,
      dialogAccept: false,
      headers: [
        {
          text: 'Nama Pegawai',
          align: 'start',
          sortable: true,
          value: 'nama_pegawai'
        },
        { text: 'Jenis Kelamin', value: 'jenis_kelamin' },
        { text: 'Telepon', value: 'hp_pegawai' },
        { text: 'Alamat', value: 'alamat_pegawai' },
        { text: 'Email', value: 'email_pegawai' },
        { text: 'Jabatan', value: 'jabatan_pegawai' },
        { text: 'Actions', value: 'actions' }
      ],
      jabatans: [
        'Pemilik',
        'Admin',
        'Kasir',
        'Pegawai'
      ],
      kelamins: [
        'Laki-laki',
        'Perempuan'
      ],
      pesanan: [],
      deleteId: '',
      editId: ''
    }
  },
  methods: {
    setForm () {
      if (this.inputType === 'Tambah') {
        this.dialogTambah = true
        this.save()
      } else if (this.inputType === 'Ubah' || this.inputType === 'Accept') {
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
    readPesanan () {
      const url = this.$api + '/getPesanan'
      this.$http.get(url, {
      }).then(response => {
        this.pesanans = response.data.data
      })
    },
    goPesanMenu () {
      this.$router.replace('/customer')
    },
    close () {
      this.dialog = false
      this.dialogAccept = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.inputType = 'Tambah'
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogAccept = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.inputType = 'Tambah'
    },
    resetForm () {
      this.form = {
        nama_pegawai: null,
        jenis_kelamin: null,
        hp_pegawai: null,
        alamat_pegawai: null,
        email_pegawai: null,
        // password: null,
        jabatan_pegawai: null
      }
    }
  },
  computed: {
    formTitle () {
      return this.inputType
    }
  },
  mounted () {
    this.readPegawaiMendaftar()
  }
}
</script>
