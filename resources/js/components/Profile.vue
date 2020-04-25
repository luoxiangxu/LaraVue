<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10 mt-3">
            <!-- Widget: user widget style 1 -->
            <div class="card card-widget widget-user">
              <!-- Add the bg color to the header using any of the bg-* classes -->
              <div class="widget-user-header text-white" style="background: url('./images/background.jpeg') center center;">
                <h3 class="widget-user-username text-left">{{this.form.name}}</h3>
                <h5 class="widget-user-desc text-left">{{this.form.type}}</h5>
              </div>
              <div class="widget-user-image">
                <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar">
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col-sm-4 border-right">
                    <div class="description-block">
                      <h5 class="description-header">3,200</h5>
                      <span class="description-text">SALES</span>
                    </div>
                    <!-- /.description-block -->
                  </div>
                  <!-- /.col -->
                  <div class="col-sm-4 border-right">
                    <div class="description-block">
                      <h5 class="description-header">13,000</h5>
                      <span class="description-text">FOLLOWERS</span>
                    </div>
                    <!-- /.description-block -->
                  </div>
                  <!-- /.col -->
                  <div class="col-sm-4">
                    <div class="description-block">
                      <h5 class="description-header">35</h5>
                      <span class="description-text">PRODUCTS</span>
                    </div>
                    <!-- /.description-block -->
                  </div>
                  <!-- /.col -->
                </div>
                <!-- /.row -->
              </div>
            </div>
            <!-- /.widget-user -->
          </div>
        </div>

        <div class="row justify-content-center mt-3">
             <div class="col-md-10">
            <div class="card">
              <div class="card-header p-2">
                <ul class="nav nav-pills">
                  <li class="nav-item"><a class="nav-link" href="#activity" data-toggle="tab">Activity</a></li>
                  <li class="nav-item"><a class="nav-link active" href="#settings" data-toggle="tab">Settings</a></li>
                </ul>
              </div><!-- /.card-header -->
              <div class="card-body">
                <div class="tab-content">
                  <div class="tab-pane" id="activity">
                    <!-- Post -->
                    <div class="post">
                        <h2>Display user activity</h2>
                    </div>
                    <!-- /.post -->
                  </div>
    

                  <div class="tab-pane active" id="settings">
                    <form @submit.prevent="updateInfo">
                      <div class="form-group">
                        <label class="font-weight-bold">Name</label>
                      <input v-model="form.name" type="text" name="name" placeholder="Name"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                      <has-error :form="form" field="name"></has-error>
                    </div>

                    <div class="form-group">
                        <label class="font-weight-bold">Email</label>
                      <input v-model="form.email" type="email" name="email" placeholder="Email"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                      <has-error :form="form" field="email"></has-error>
                    </div>

                    <div class="from-group">
                        <label for="Profile Photo">Profile Photo</label>
                      <input type="file" name="photo" @change="updateProfile"
                        class="form-control-file" :class="{ 'is-invalid': form.errors.has('photo')}">
                      <has-error :form="form" field="photo"></has-error>
                    </div>
                    
                    <div class="form-group pt-3">
                        <label class="font-weight-bold">Password (leave empty if not changing)</label>
                      <input v-model="form.password" type="password" name="password" placeholder="Password"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                      <has-error :form="form" field="password"></has-error>
                    </div>

                      <div class="form-group">
                          <button type="submit" class="btn btn-success">Submit</button>
                      </div>
                    </form>
                  </div>
                  <!-- /.tab-pane -->
                </div>
                <!-- /.tab-content -->
              </div><!-- /.card-body -->
            </div>
            <!-- /.nav-tabs-custom -->
          </div>
        </div>
       
    </div>
</template>

<style scoped>
    .widget-user-header{
        height: 250px;
    }
    .widget-user .widget-user-image > img {
    border: 3px solid #ffffff;
    width: 120px;
    height: 120px;
    }
</style>

<script>
    export default {
        data() {
            return {
                form : new Form({
                    id:'',
                    name:'',
                    email:'',
                    password:'',
                    type:'',
                    bios:'',
                    photo:''
                })
            }
        },
        mounted() {
            console.log('Component mounted.')
        },
        methods:{
            getProfilePhoto(){
              return "images/profile/"+ this.form.photo
            },
            updateProfile(element){
                let file = element.target.files[0];
                let reader = new FileReader();
                if(file['size'] < 2111775){
                  reader.onloadend = (file)=> {
                    this.form.photo = reader.result;
                  }
                  reader.readAsDataURL(file); 
                }else{
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Image size must be less than 2MB.',
                  })
                }
                
            },
            updateInfo(){
                this.$Progress.start();
                this.form.put('api/profile/')
                .then(()=>{ 
                  Toast.fire({
                    icon: 'success',
                    title: 'User updated successfully'
                  });
                  Fire.$emit('reloadUser');
                  this.$Progress.finish();
                })
                .catch(()=>{
                  this.$Progress.fail();
                })
            },
            loadUser(){
              axios.get('api/profile')
            .then(({data})=>(this.form.fill(data)));
            }
        },
        mounted() {
            this.loadUser();
            Fire.$on('reloadUser',()=> {
              this.loadUser()
            });
        }
    }
</script>
