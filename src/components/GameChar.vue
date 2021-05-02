<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn
          block
          @click="attack"
          :disabled="$parent.lockMove"
          class="red white--text"
          >attack</v-btn
        >
        &nbsp;
        <v-btn
          block
          @click="defend"
          :disabled="$parent.lockMove"
          class="green white--text"
          >defend</v-btn
        >
      </v-col>
    </v-row>
    <br />
    <v-card v-if="!gameOver">
      <v-card-text class="toon-bg white--text pa-10">
        <v-row style="height: 75px;">
          <v-progress-linear
            v-model="progressHp"
            :buffer-value="progressMaxHp"
            color="green"
            background-color="red"
          ></v-progress-linear>

          <br />

          <h1 style="height: 50px;" class="blue--text">
            Lv.{{ toon.level }} {{ toon.name }}
            <span style="font-size: 10pt;" v-if="equip"
              >in <span style="font-size: 14pt;">{{ equip.name }}</span></span
            >
          </h1>

          <v-spacer></v-spacer>
          <span v-if="toon.status.defending"
            ><img
              style="float: right; display: inline-block; overflow: auto;"
              height="50px"
              src="../assets/shield.png"
              alt=""
          /></span>
        </v-row>

        <!-- <v-row>
          <v-col>
            <span
          :class="
            toon.hp < $parent.percent(30, maxHealth)
              ? 'red--text'
              : 'green--text'
          "
        >
          HP: {{ toon.hp }}

        </span>
          </v-col>
        </v-row> -->

        <v-container fluid>
          <v-row>
            <v-col cols="auto">
              <h2>
                HP:
                <span
                  :class="
                    toon.hp < $parent.percent(30, maxHealth)
                      ? 'red--text'
                      : 'green--text'
                  "
                >
                  {{ toon.hp }}
                </span>
              </h2>
              <h2>AP: {{ attackPower }} + {{ toon.selectedWeapon.ap }}</h2>
              <h2>AC: {{ armorClass }}</h2>
            </v-col>

            <v-col cols="auto">
              <div>Strength: {{ toon.strength }}</div>
              <div>Dexterity: {{ toon.dexterity }}</div>
              <div>Vigor: {{ toon.vigor }}</div>
              <div>Willpower: {{ toon.willpower }}</div>
            </v-col>
            <v-col cols="auto">
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
          <v-row>
            <game-weapon
              :inventory="inventory"
              :selectedWeapon="this.toon.selectedWeapon"
              @changeWeapon="changeWeapon"
            >
            </game-weapon>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
        <v-card v-else>
      <v-card-text class="toon-bg white--text pa-10">

          <h1 style="text-align: center">You died</h1>

      </v-card-text>
    </v-card>
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
    gameOver: Boolean,
  },
  data: function() {
    return {};
  },
  computed: {
    maxHealth() {
      return this.toon.vigor * 10;
    },
    armorClass() {
      let armor = 0;
      if (this.equip) {
        armor = this.equip.ac;
      }
      return this.toon.dexterity * 1.5 + armor;
    },
    attackPower() {
      return Math.floor(this.toon.strength + this.toon.dexterity / 2) + Math.floor(this.toon.level*1.5);
    },
    progressHp() {
      return this.toon.hp / 2;
    },
    progressMaxHp() {
      return this.maxHealth / 2;
    },
  },
  methods: {
    attack() {
      if (!this.$parent.encounter.length) {
        return;
      }
      this.toon.status.defending = false;

      // Roll damage and add weapon damage
      let damage = this.$parent.rollDamage(this.toon.ap),
        sw = this.toon.selectedWeapon;
      console.log(this.toon.ap);
      console.log(damage + " roll");
      if (sw) {
        damage += sw.ap;
        sw.uses -= 1;
      }
      if (!sw.uses && sw.name != "Unarmed") {
        this.inventory.splice(this.inventory.indexOf(sw), 1);
        this.toon.selectedWeapon = this.inventory[0];
        this.$parent.combatLog.push(`${sw.name} breaks and is destroyed!`);
      }

      console.log(damage + " weapon");

      // check if final battle, willpower and vigor go a long way when fighting a dragon
      if (this.$parent.finalBattle) {
        damage += Math.floor(this.toon.willpower * 1.5) + Math.floor(this.toon.vigor * 1.5);
      }

      // add bloodlust damage
      if(this.toon.status.lust) {
          damage+=this.$parent.stage*5;
      }

      this.$emit("action", damage);
    },
    defend() {
      if (!this.$parent.encounter.length) {
        return;
      }
      this.toon.status.defending = true;

      // heal
      let roll = this.toon.willpower + this.$parent.rollDamage(this.toon.vigor);

      if (this.toon.hp + roll >= this.maxHealth) {
        this.toon.hp = this.maxHealth;
      } else {
        this.toon.hp += roll;
        this.$parent.combatLog.push(`${this.toon.name} heals for ${roll}!`);
      }

      // negate special attacks
      if (this.$parent.specialActions.pushOff > 1) {
        this.$parent.specialActions.pushOff -= 1;
        this.$parent.combatLog.push(`${this.toon.name} steadies!`);
      }

      this.$emit("action", false);
    },
    spendPoint(attribute) {
      this.toon.points -= 1;
      return (attribute += 1);
    },
    changeWeapon(w) {
      this.toon.selectedWeapon = w;
    },
  },
  created() {
    this.toon.hp = this.maxHealth;
    this.toon.ac = this.armorClass;
    this.toon.ap = this.attackPower;
    this.toon.selectedWeapon = this.inventory[0];
    //  this.inventory.push({
    //    name: "Club",
    //    ap: 15,
    //    uses: 20,
    //    maxUses: 20,
    //    cost: 50,
    //  });
    // this.inventory.push({
    //   name: "Crossbow",
    //   ap: 20,
    //   uses: 10,
    //   maxUses: 10,
    //   cost: 75,
    // });
    // this.inventory.push({
    //   name: "Falchion",
    //   ap: 25,
    //   uses: 3,
    //   maxUses: 3,
    //   cost: 100,
    // });
    // this.inventory.push({
    //   name: "Halberd",
    //   ap: 45,
    //   uses: 3,
    //   maxUses: 3,
    //   cost: 350,
    // });
    // this.inventory.push({
    //   name: "Death Star",
    //   ap: 88,
    //   uses: 1,
    //   maxUses: 2,
    //   cost: 1000,
    // });
  },
};
</script>

<style></style>
