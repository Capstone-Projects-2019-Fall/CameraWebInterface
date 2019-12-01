<template>
  <v-container class="home">
 
    <v-row class="pb-3">
     
      <v-card  >
          <v-card-title class="cyan">What is MSPi?</v-card-title>
          <v-row>
            <v-col sm="2">
              <v-img src="../assets/mspi.png"
          max-height="50%"
          contain
          
        ></v-img>
            </v-col>
            <v-col sm="10">
          <v-card-text >
            MSPi is a motion-capture security camera that provides users with live alerts as to what
              occurs within and around their home. The target audience for this device is mainly suburban
              and urban home owners as well as frequent Amazon shoppers. 
          </v-card-text>
        </v-col>
        </v-row>
      </v-card>
  </v-row>


  <v-row class="pb-3">
    
    <v-card>
      <v-card-title class="cyan">Features</v-card-title>
    
      <v-row>

        <v-col sm="4">
          <v-card flat>
            <v-card-title class="justify-center"><v-icon large>mdi-cctv</v-icon></v-card-title>
            <v-card-text class="black--text">
              Add mutiple cameras to your account to monitor multiple spots around your home.
            </v-card-text>
          </v-card>
        </v-col>

        <v-col sm="4">
          <v-card flat>
            <v-card-title class="justify-center"><v-icon large>mdi-face</v-icon></v-card-title>
            <v-card-text class="black--text">
              Equipped with training module, the system allows you to train it to recognize multiple faces. 
              Know when your loved ones return home.
            </v-card-text>
          </v-card>
        </v-col>

        <v-col sm="4">
          <v-card flat>
            <v-card-title class="justify-center"><v-icon large>mdi-motion-sensor</v-icon></v-card-title>
            <v-card-text class="black--text">
              The system enabled with motion and human shape detection, so you only get notified when a person
              approaches your home.
            </v-card-text>
          </v-card>
        </v-col>

      </v-row>

      <v-row>

        <v-col sm="4">
          <v-card flat>
            <v-card-title class="justify-center"><v-icon large>mdi-bell-ring</v-icon></v-card-title>
            <v-card-text class="black--text">
              Get a notification via email when someone approches your home and view all of you notifications
              via website or mobile application.
            </v-card-text>
          </v-card>
        </v-col>

        <v-col sm="4">
          <v-card flat >
            <v-card-title class="justify-center"><v-icon large>mdi-microphone</v-icon></v-card-title>
            <v-card-text class="black--text">
              Communicate with the person at your doorstep using two-way communication feature via website or mobile application.
            </v-card-text>
          </v-card>
        </v-col>

        <v-col sm="4">
          <v-card flat >
            <v-card-title class="justify-center"><v-icon large>mdi-monitor-cellphone</v-icon></v-card-title>
            <v-card-text class="black--text">
              Monitor your home at any time using live video streaming. Connect via website or mobile application. 
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-card>
  </v-row>

   
  

    


  </v-container>
</template>

