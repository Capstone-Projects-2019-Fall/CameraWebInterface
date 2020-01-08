<template>
  <v-container class="home">
    <v-row class="pb-3" justify="center">
      <v-col sm="10" md="8">
        <v-card class="elevation-0">
          <v-card-title class="cyan pb-0"
            ><v-spacer></v-spacer>
            <p class="display-1">What is MSPi?</p>
            <v-spacer></v-spacer
          ></v-card-title>
          <v-container fluid>
            <v-row justify="center">
              <v-col cols="auto" md="3">
                <v-avatar class="ma-3" size="125" tile>
                  <v-img src="../assets/mspi.png" contain></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="auto" md="9">
                <v-card-text>
                  <p class="headline" style="text-align: justify;">
                    MSPi is a motion-capture security camera that provides users
                    with live alerts as to what occurs within and around their
                    home. The target audience for this device is mainly suburban
                    and urban home owners as well as frequent Amazon shoppers.
                  </p>
                </v-card-text>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="pb-3 mt-8" justify="center">
      <p class="display-1">
        Features
      </p>
    </v-row>

    <v-row class="pb-3" justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card flat>
          <v-card-title class="justify-center"
            ><v-icon large>mdi-cctv</v-icon></v-card-title
          >
          <v-card-text class="black--text">
            Add mutiple cameras to your account to monitor multiple spots around
            your home.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card flat>
          <v-card-title class="justify-center"
            ><v-icon large>mdi-face</v-icon></v-card-title
          >
          <v-card-text class="black--text">
            Equipped with training module, the system allows you to train it to
            recognize multiple faces. Know when your loved ones return home.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card flat>
          <v-card-title class="justify-center"
            ><v-icon large>mdi-motion-sensor</v-icon></v-card-title
          >
          <v-card-text class="black--text">
            The system enabled with motion and human shape detection, so you
            only get notified when a person approaches your home.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card flat>
          <v-card-title class="justify-center"
            ><v-icon large>mdi-bell-ring</v-icon></v-card-title
          >
          <v-card-text class="black--text">
            Get a notification via email when someone approches your home and
            view all of you notifications via website or mobile application.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card flat>
          <v-card-title class="justify-center"
            ><v-icon large>mdi-microphone</v-icon></v-card-title
          >
          <v-card-text class="black--text">
            Communicate with the person at your doorstep using two-way
            communication feature via website or mobile application.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card flat>
          <v-card-title class="justify-center"
            ><v-icon large>mdi-monitor-cellphone</v-icon></v-card-title
          >
          <v-card-text class="black--text">
            Monitor your home at any time using live video streaming. Connect
            via website or mobile application.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
