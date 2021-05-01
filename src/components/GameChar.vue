<template>
  <v-container>
    <v-card>
      <v-card-text>
          <v-col height="50">

        <h1 class="blue--text">Lv.{{ toon.level }} {{ toon.name }}<span v-if="toon.defending"><img style="float: right;" height="50px" src="../assets/shield.png" alt=""></span></h1>
          </v-col>
        
        
        
        <br />
        <v-row>
            <v-col>
        <h1
          :class="
            toon.hp < $parent.percent(30, maxHealth)
              ? 'red--text'
              : 'green--text'
          "
        >
          HP: {{ toon.hp }}
        </h1>
        </v-col>

        </v-row>
        
        <v-container fluid>
        <v-row>
          <v-col cols="auto">
            <h2>AP: {{ attackPower }} + {{ toon.selectedWeapon.ap }}</h2>
            <h2>AC: {{ armorClass }}</h2>
            <br/>
            <h2 v-if="equip" class="yellow">{{ equip.name }}</h2>

          </v-col>

          <v-col>
              
             <div>
              Strength: {{ toon.strength }} </div>
             <div>
              Dexterity: {{ toon.dexterity }} </div>
                           <div>
              Vigor: {{ toon.vigor }} </div>
                           <div>
              Willpower: {{ toon.willpower }} </div>
</v-col>
<v-col >
    <div>
        
              <v-btn
              
              min-width="10"
                v-if="toon.points"
                @click="toon.strength = spendPoint(toon.strength)"
                color="accent"
                elevation="3"
                x-small
                >&plus;</v-btn
              >
              <span v-if="toon.points"> ({{ toon.points }})</span>
              </div>
              
              <div>
              <v-btn
              min-width="10"
                v-if="toon.points"
                @click="toon.dexterity = spendPoint(toon.dexterity)"
                color="accent"
                elevation="3"
                x-small
                >&plus;</v-btn
              >
              <span v-if="toon.points"> ({{ toon.points }})</span>
              </div>
              <div>
              <v-btn
              min-width="10"
                v-if="toon.points"
                @click="toon.vigor = spendPoint(toon.vigor)"
                color="accent"
                elevation="3"
                x-small
                >&plus;</v-btn
              >
              <span v-if="toon.points"> ({{ toon.points }})</span>
              </div>

        <div>
              <v-btn
              min-width="10"
                v-if="toon.points"
                @click="toon.willpower = spendPoint(toon.willpower)"
                color="accent"
                elevation="3"
                x-small
                >&plus;</v-btn
              >
              <span v-if="toon.points"> ({{ toon.points }})</span>
            </div>
          </v-col>

        <v-col>
            <h2>Gold: {{ toon.gold }}</h2>
        </v-col>
        </v-row>
        </v-container>
       
      </v-card-text>
      <game-weapon :inventory="inventory" :selectedWeapon="this.toon.selectedWeapon" @changeWeapon="changeWeapon"> </game-weapon>
    </v-card>
    <v-row>
      <v-col>
        <v-btn
          @click="attack"
          :disabled="$parent.lockMove"
          class="red white--text"
          >attack</v-btn
        >
        &nbsp;
        <v-btn
          @click="defend"
          :disabled="$parent.lockMove"
          class="green white--text"
          >defend</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GameWeapon from "./GameWeapon";

export default {
  components: {
    GameWeapon,
  },
  props: {
    toon: Object,
      inventory: Array,
      equip: Object,
  },
  data: function() {
    return {
    };
  },
  computed: {
    maxHealth() {
      return this.toon.vigor * 10;
    },
    armorClass() {
        let armor = 0;
        if(this.equip) {
            armor = this.equip.ac;
        }
      return (this.toon.dexterity * 2) + armor;
    },
    attackPower() {
      return Math.floor(this.toon.strength + this.toon.dexterity / 2);
    },
  },
  methods: {
    attack() {
      this.toon.defending = false;

      // Roll damage and add weapon damage
      let damage = this.$parent.rollDamage(this.toon.ap),
        sw = this.toon.selectedWeapon;
      console.log(this.toon.ap);
      console.log(damage + " roll");
      if (sw) {
        damage += sw.ap;
        sw.uses -= 1;
      }
      if(!sw.uses && sw.name != 'Unarmed') {
          this.inventory.splice(this.inventory.indexOf(sw), 1);
          this.$parent.combatLog.push(`${sw.name} breaks and is destroyed!`);
      }

      console.log(damage + " weapon");

      this.$emit("action", damage);
    },
    defend() {
      this.toon.defending = true;

      this.$emit("action", false);
    },
    spendPoint(attribute) {
      this.toon.points -= 1;
      return (attribute += 1);
    },
    changeWeapon(w) {
        this.toon.selectedWeapon = w;
    }
  },
  created() {
    this.toon.hp = this.maxHealth;
    this.toon.ac = this.armorClass;
    this.toon.ap = this.attackPower;
    this.toon.selectedWeapon =  this.inventory[0];

  },
};
</script>

<style></style>
