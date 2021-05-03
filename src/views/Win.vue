<template>
  <v-container>
    <v-card>
      <v-card-text class="panel-bg white--text pa-10">
        <v-container>
          <h1 style="text-align: center">{{ message }}</h1>
          <br>
    <v-card v-if="!gameOver">
      <v-card-text class="toon-bg grey--text pa-10" :style="`${toon.background}`">
        <v-row style="height: 75px;">


          <br />

          <h1 style="height: 50px;" class="toon-title fontshadow">
            Lv.{{ toon.level }} {{ toon.name }}
            <span style="font-size: 10pt;" v-if="equip"
              >in <span style="font-size: 14pt;">{{ equip.name }}</span></span
            >
          </h1>

          <v-spacer></v-spacer>

        </v-row>


        <v-container fluid>
          <v-row>
            <v-col cols="auto">
              <h2>
                HP:
                <span class="green--text">
                  {{ toon.hp }}
                </span>
              </h2>
              <h2>
                AP: <span class="red--text"> {{ attackPower }}</span> +
                <span class="red--text">{{ toon.selectedWeapon.ap }}</span>
              </h2>
              <h2>
                AC: <span class="cyan--text">{{ armorClass }}</span>
              </h2>
            </v-col>

            <v-col cols="auto">
              <h3>
                Strength: <span class="orange--text"> {{ toon.strength }}</span>
              </h3>
              <h3>
                Dexterity:<span class="lime--text"> {{ toon.dexterity }}</span>
              </h3>
              <h3>
                Vigor: <span class="red--text"> {{ toon.vigor }}</span>
              </h3>
              <h3>
                Willpower: <span class="blue--text"> {{ toon.willpower }}</span>
              </h3>
            </v-col>


            <v-col>
              <h2>
                Gold: <span class="yellow--text">{{ toon.gold }}</span>
              </h2>
              <h2>
                XP: <span class="blue--text">{{ toon.xp }}</span>
              </h2>
            </v-col>
          </v-row>

        </v-container>
      </v-card-text>
    </v-card>
        </v-container>

      </v-card-text>
    </v-card>


  </v-container>
</template>

<script>

export default {
  name: "Win",
  props: {
    toon: Object,
  },
  computed: {
        armorClass() {
      let armor = 0;
      if (this.equip) {
        armor = this.equip.ac;
      }
      return this.toon.dexterity * 1.5 + armor;
    },
    attackPower() {
      return (
        Math.floor(this.toon.strength + this.toon.dexterity / 2) +
        Math.floor(this.toon.level * 1.5)
      );
  },
  },
  data() {
    return {
      message: "Congratulations. You have beat SMASHERS!\"#%",
     
    };
  },
};
</script>

<style scoped>
.toon-title {
  color: goldenrod;
}
</style>
