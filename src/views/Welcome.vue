<template>
  <v-container>
    <v-card>
      <v-card-text class="panel-bg white--text pa-10">
        <v-container>
          <h1>{{ welcome }}</h1>
          <h3>{{ message }}</h3>
        </v-container>
        <v-container fluid >
          <v-row  @click="$emit('begin', toon)" v-for="toon in characters" v-bind:key="toon.name" class="ma-1 pa-1 highlight">
<v-col>

            <h1
              
              style="height: 50px;"
              class="fontshadow"
            >
              {{ toon.name }}
            </h1>
</v-col>
              <v-col cols="auto">
                <h3>
                  Strength:
                  <span class="orange--text"> {{ toon.strength }}</span>
                </h3>
                <h3>
                  Dexterity:<span class="lime--text">
                    {{ toon.dexterity }}</span
                  >
                </h3>
                </v-col>
                <v-col>
                  
                <h3>
                  Vigor: <span class="red--text"> {{ toon.vigor }}</span>
                </h3>
                <h3>
                  Willpower:
                  <span class="blue--text"> {{ toon.willpower }}</span>
                </h3>
              </v-col>
              <v-col>
                            <h2
              
              style="height: 50px;"
              class="fontshadow"
            >
              {{ toon.difficulty }}
            </h2>
              </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

    <!-- <router-link to="/Game"> -->
    <!-- </router-link> -->
  </v-container>
</template>

<script>
export default {
  name: "Welcome",
  components: {},

  data() {
    return {
      welcome: 'Welcome to SMASHERS!"#%',
      message: "Pick a character:",
      characters: [
        {
          background: "background: linear-gradient(180deg,rgba(12, 80, 92, 0.95) 0%,rgba(51, 1, 26, 0.9) 75%)",
          difficulty: "Hard",
          lines: ['Any%!', "Therefore, dragon."],
          name: "Depraved",
          pacifist: false,
          level: 1,
          xp: 0,
          points: 0,
          gold: 0,
          hp: null,
          ac: null,
          ap: null,
          selectedWeapon: null,

          defending: false,
          recovering: false,
          sacrifice: false,
          lust: false,

          strength: 2,
          dexterity: 4,
          willpower: 10,
          vigor: 3,
        },
        {
          background: "background: linear-gradient(180deg,rgb(0, 55, 86, 0.95) 0%,rgba(0, 80, 85, 0.9) 75%)",
          difficulty: "Normal",
          lines: ['They drew first blood!', "Of course it's a dragon!!"],
          name: "Rambo",
          pacifist: false,
          level: 1,
          xp: 0,
          points: 0,
          gold: 0,
          hp: null,
          ac: null,
          ap: null,
          selectedWeapon: null,

          defending: false,
          recovering: false,
          sacrifice: false,
          lust: false,

          strength: 8,
          dexterity: 6,
          willpower: 4,
          vigor: 5,
        },
        {
          background: "background: linear-gradient(180deg, rgba(0, 86, 39, 0.95) 0%, rgba(0, 27, 85, 0.9) 75%)",
          difficulty: "Interesting",
          lines: ["Who needs weapons when you have the power of god? These creatures don't like hearing their name <b class=\"cyan--text\">sdrawkcab</b>. For bigger creatures with something to say, I might be able to use their <b class=\"cyan--text\">sdrow</b> against them!", "Not even a dragon can withstand my verses!"], 
          name: "Pharc",
          pacifist: true,
          level: 1,
          xp: 0,
          points: 0,
          gold: 100,
          hp: null,
          ac: null,
          ap: null,
          selectedWeapon: null,

          defending: false,
          recovering: false,
          sacrifice: false,
          lust: false,

          strength: 16,
          dexterity: 16,
          willpower: 14,
          vigor: 15,
        },
      ],
    };
  },
};
</script>

<style>
.highlight:hover {
  border-radius: 5px;
  cursor: pointer;
  /* background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 0.95) 0%,
    rgba(8, 21, 63, 0.95) 24%,
    rgba(9, 20, 121, 0.8) 66%
  ); */
  background: rgba(63, 165, 190, 0.171);
}</style>
