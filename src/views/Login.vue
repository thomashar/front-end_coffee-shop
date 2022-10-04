<template>
  <main>
    <v-container fluid fill-height class="posisinya">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm6 elevation-6>
          <v-card>
            <v-card-text class="pt-4">
              <div>
                <v-form v-model="valid" ref="form">
                  <v-text-field label="E-mail" v-model="email_pegawai" :rules="emailRules" required>
                  </v-text-field>
                  <v-text-field label="Password" v-model="password" type="password" min="8" :rules="passwordRules" counter clearable required>
                  </v-text-field>
                <div>
                  <v-layout class=" mt-6 ml-2" justify-space-between>
                    <link class="text-sm-body-2" @click="dialogRegister = true">
                      Register
                    <div>
                      <v-btn class="mr-2" @click="submit" :class=" { 'grey darken-1 white--text' : valid, disabled: !valid }">
                        Go
                      </v-btn>
                      <v-btn @click="clear" class="grey darken-3 white--text">
                        Clear
                      </v-btn>
                    </div>
                  </v-layout>
                </div>
                <v-dialog v-model="dialogRegister" persistent max-width="600px">
                  <v-card>
                      <v-card-title>
                          <span class="headline">Register</span>
                      </v-card-title>
                      <v-card-text>
                          <v-container>
                              <v-text-field
                                  v-model="form.nama_pegawai"
                                  label="Nama"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="form.jenis_kelamin"
                                  label="Jenis Kelamin"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="form.hp_pegawai"
                                  label="No. Telpon"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="form.alamat_pegawai"
                                  label="Alamat"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="form.email_pegawai"
                                  label="Email"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="form.password"
                                  label="Password"
                                  required
                              ></v-text-field>
                          </v-container>
                      </v-card-text>
                      <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="cancel()">
                              Cancel
                          </v-btn>
                          <v-btn color="blue darken-1" text @click="save">
                              Save
                          </v-btn>
                      </v-card-actions>
                  </v-card>
                </v-dialog>

                </v-form>
              </div>
            </v-card-text>
          </v-card>
          <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{error_message}}
          </v-snackbar>
        </v-flex>
      </v-layout>
    </v-container>
  </main>
</template>

<style>
  @import url("https://fonts.googleapis.com/css?family=Jolly%20Lodger");
  .grey--text {
    font-family: "Jolly Lodger";
  }
  .posisinya {
    position: absolute;
    top: 20px;
    left: 0px;
    right: 0px;
  }
</style>

<script>
export default {
  name: 'login-view',
  data () {
    return {
      dialogRegister: false,
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      valid: false,
      pegawai: new FormData(),
      form: {
        nama_pegawai: '',
        jenis_kelamin: '',
        hp_pegawai: null,
        alamat_pegawai: '',
        email_pegawai: '',
        password: ''
      },
      password: '',
      passwordRules: [
        (v) => !!v || 'Password tidak boleh kosong'
      ],
      email_pegawai: '',
      emailRules: [
        (v) => !!v || 'Email tidak boleh kosong'
      ]
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) { // cek apakah data yang akan dikirim sudah valid
        this.load = true
        this.$http.post(this.$api + '/login', {
          email_pegawai: this.email_pegawai,
          password: this.password
        }).then(response => {
          localStorage.setItem('id', response.data.pegawai.id) // menyimpan id pegawai yang sedang login
          localStorage.setItem('token', response.data.access_token)
          localStorage.setItem('role', response.data.pegawai.jabatan_pegawai)
          localStorage.setItem('nama', response.data.pegawai.nama_pegawai)
          // menyimpan auth token
          if (response.data.pegawai.delete_pegawai !== 1) {
            this.error_message = response.data.message
            this.color = 'green'
            this.snackbar = true
            this.load = false
            this.clear()
            this.$router.push({
              name: 'profile'
            })
          }
        }).catch(error => {
          this.error_message = error.response.data.message
          this.color = 'red'
          this.snackbar = true
          localStorage.removeItem('token')
          this.load = false
        })
      }
    },
    save () {
      this.pegawai.append('nama_pegawai', this.form.nama_pegawai)
      this.pegawai.append('jenis_kelamin', this.form.jenis_kelamin)
      this.pegawai.append('hp_pegawai', this.form.hp_pegawai)
      this.pegawai.append('alamat_pegawai', this.form.alamat_pegawai)
      this.pegawai.append('email_pegawai', this.form.email_pegawai)
      this.pegawai.append('password', this.form.password)

      const url = this.$api + '/register'
      this.load = true
      this.$http.post(url, this.pegawai, {
        // headers: {
        //   Authorization: 'Bearer ' + localStorage.getItem('token')
        // }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    cancel () {
      this.resetForm()
      this.dialogRegister = false
    },
    resetForm () {
      this.form = {
        nama_pegawai: null,
        jenis_kelamin: null,
        hp_pegawai: null,
        alamat_pegawai: null,
        email_pegawai: null,
        password: null
      }
      this.$forceUpdate()
    },
    clear () {
      this.$refs.form.reset() // Clear form login
    }
  }
}
</script>
