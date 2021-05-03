<template>
  <v-container>
    <v-card>
      <v-card-text class="panel-bg white--text pa-10">
        <v-container>
          <h1 style="text-align: center">{{ message }}</h1>
          <br>
    <v-card>
      <v-card-text class="grey--text pa-10" :style="`${toon.background}`">
        <v-row style="height: 75px;">


          <br />

          <h1 style="height: 50px;" class="toon-title fontshadow">
            Lv.{{ toon.level }} {{ toon.name }}
            <span style="font-size: 10pt;" v-if="toon.equip"
              >in <span style="font-size: 14pt;">{{ toon.equip.name }}</span></span
            >
          </h1>

          <v-spacer></v-spacer>

        </v-row>


        <v-container fluid>
          <v-row>
            <v-col cols="auto">
              <h2>
                Health Pool:
                <span class="green--text">
                  {{ maxHealth }}
                </span>
              </h2>
              <h2>
                Attack Power: <span class="red--text"> {{ attackPower }}</span>
              </h2>
              <h2>
                Armor Class: <span class="cyan--text">{{ armorClass }}</span>
              </h2>
            </v-col>

            <v-col cols="auto">
              <h3>
                Strength: <span class="orange--text"> {{ toon.strength }}</span>
              </h3>
              <h3>
                Dexterity:<span class="lime--text"> {{ toon.dexterity }}</span>
              </h3>
            </v-col>
              <v-col cols="auto">
              <h3>
                Vigor: <span class="red--text"> {{ toon.vigor }}</span>
              </h3>
              <h3>
                Willpower: <span class="blue--text"> {{ toon.willpower }}</span>
              </h3>
            </v-col>


            <v-col cols="auto">
              <h2>
                Gold: <span class="yellow--text">{{ toon.gold }}</span>
              </h2>
              <h2>
                Spent Gold: <span class="yellow--text">{{ spentGold }}</span>
              </h2>
              <h2>
                Experience: <span class="blue--text">{{ toon.xp }}</span>
              </h2>
            </v-col>

                        <v-col cols="auto">
              <h2>
                Weapon Uses: <span class="white--text">{{ weaponUses }}</span>
              </h2>
              <h2>
                Stage: <span class="white--text">{{ stage }}</span>
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
    spentGold: Number,
    weaponUses: Number,
    stage: Number,
  },
  computed: {
        maxHealth() {
      return this.toon.vigor * 10;
    },
        armorClass() {
      let armor = 0;
      if (this.toon.equip) {
        armor = this.toon.equip.ac;
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
