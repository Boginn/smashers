<template>
  <v-container>
     
    <v-row v-if="!$parent.outOfCombat">
      <v-col v-if="toon.pacifist">
        <v-btn
          block
          height="70" 
          @click="meditate"
          :disabled="$parent.lockMove"
          v-bind:class="{ disbld: $parent.lockMove }"
          class="defend-bg yellow--text fontshadow"
          >meditate</v-btn
        >
      </v-col>
      <v-col v-if="!gameOver && !toon.pacifist">
        <v-btn
          block
          height="70"
          @click="attack"
          :disabled="$parent.lockMove"
          v-bind:class="{ disbld: $parent.lockMove }"
          class="attack-bg yellow--text fontshadow"
          >attack</v-btn
        >
      </v-col>
      <v-col v-if="!gameOver && !toon.pacifist">
        <v-btn
          block
          height="70"
          @click="defend"
          :disabled="$parent.lockMove"
          v-bind:class="{ disbld: $parent.lockMove }"
          class="defend-bg yellow--text fontshadow"
          >defend</v-btn
        >
      </v-col>
    </v-row>
    <br />
    <v-card v-if="!gameOver">
      <v-card-text class="grey--text pa-10" :style="`${toon.background}`">
        <v-row style="height: 75px;">
          <v-progress-linear
            height="15"
            v-model="progressHp"
            :buffer-value="progressMaxHp"
            color="green"
            background-color="red"
          ></v-progress-linear>

          <br />

          <h1 style="height: 50px;" class="toon-title fontshadow">
            Lv.{{ toon.level }} {{ toon.name }}
            <span style="font-size: 10pt;" v-if="toon.equip"
              >in <span style="font-size: 14pt;">{{ toon.equip.name }}</span></span
            >
          </h1>

          <v-spacer></v-spacer>
          <span v-if="toon.defending"
            ><img
              style="float: right; display: inline-block; overflow: auto;"
              height="50px"
              src="../assets/shield.png"
              alt=""
          /></span>
          <span v-if="toon.lust"
            ><img
              style="float: right; display: inline-block; overflow: auto;"
              height="50px"
              src="../assets/lust.png"
              alt=""
          /></span>
          <span v-if="toon.sacrifice"
            ><img
              style="float: right; display: inline-block; overflow: auto;"
              height="50px"
              src="../assets/sacrifice.png"
              alt=""
          /></span>
        </v-row>

        <v-container fluid>
          <v-row style="align-items: center;">
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
            <v-col cols="auto">
              <div>
                <v-btn
                  min-width="10"
                  v-if="toon.points"
                  @click="toon.strength = spendPoint(toon.strength)"
                  elevation="3"
                  x-small
                  style="background: goldenrod; color: white"
                  >&plus;</v-btn
                >
                <span v-if="toon.points"> (<b class="white--text">{{ toon.points }}</b>)</span>
              </div>

              <div>
                <v-btn
                  min-width="10"
                  v-if="toon.points"
                  @click="toon.dexterity = spendPoint(toon.dexterity)"
                  elevation="3"
                  x-small
                  style="background: goldenrod; color: white"
                  >&plus;</v-btn
                >
                <span v-if="toon.points"> (<b class="white--text">{{ toon.points }}</b>)</span>
              </div>
              <div>
                <v-btn
                  min-width="10"
                  v-if="toon.points"
                  @click="toon.vigor = spendPoint(toon.vigor)"
                  elevation="3"
                  x-small
                  style="background: goldenrod; color: white"
                  >&plus;</v-btn
                >
                <span v-if="toon.points"> (<b class="white--text">{{ toon.points }}</b>)</span>
              </div>

              <div>
                <v-btn
                  min-width="10"
                  v-if="toon.points"
                  @click="toon.willpower = spendPoint(toon.willpower)"
                  elevation="3"
                  x-small
                  style="background: goldenrod; color: white"
                  >&plus;</v-btn
                >
                <span v-if="toon.points"> (<b class="white--text">{{ toon.points }}</b>)</span>
              </div>
            </v-col>

            <v-col cols="auto">
              <h2>
                Gold: <span class="yellow--text">{{ toon.gold }}</span>
              </h2>
              <h2>
                XP: <span class="blue--text">{{ toon.xp }}</span>
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <game-weapon
              :inventory="inventory"
              :selectedWeapon="toon.selectedWeapon"
              :toon="toon"
              :lockMove="$parent.lockMove"
              @preach='preach'
              @changeWeapon="changeWeapon"
            >
            </game-weapon>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-text class="white--text pa-10" :style="`${toon.background}`">
        <h1 style="text-align: center">You died</h1>
        <br>
      <v-btn
      @click="$router.go()"
      block
      outlined
      class="white--text">New Game</v-btn>
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
    gameOver: Boolean,
    ogrePushing: Number,
    weaponUses: Number,
  },
  data: function() {
    return {
        input: '',
        
    };
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
    progressHp() {
      if (this.maxHealth >= 100) {
          return this.toon.hp / 2;
      } else if (this.maxHealth >= 200) {
          return this.toon.hp / 3;

      }
      return this.toon.hp;
    },
    progressMaxHp() {
      if (this.maxHealth >= 100) {
        return this.maxHealth / 2;
      } else if (this.maxHealth >= 200) {
          return this.maxHealth / 3;

      }
      return this.maxHealth;
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
        this.$emit('weaponUsed');
      }
      if (!sw.uses && sw.name != "Unarmed") {
        this.inventory.splice(this.inventory.indexOf(sw), 1);
        this.toon.selectedWeapon = this.inventory[0];
        this.$parent.combatLog.push(`${sw.name} breaks and is destroyed!`);
      }

      console.log(damage + " weapon");

      // check if final battle, willpower and vigor go a long way when fighting a dragon
      if (this.$parent.finalBattle) {
        damage +=
          Math.floor(this.toon.willpower * 0.8) +
          Math.floor(this.toon.vigor * 0.8);
      }

      // add bloodlust damage
      if (this.toon.lust) {
        damage += this.$parent.stage * 3;
      }

      this.$emit("action", damage);
    },
    defend() {
      this.toon.defending = true;

      // heal
      let roll = this.toon.willpower + this.$parent.rollDamage(this.toon.vigor);

      if (this.toon.hp + roll >= this.maxHealth) {
        this.toon.hp = this.maxHealth;
      } else {
        this.toon.hp += roll;
        this.$parent.combatLog.push(`${this.toon.name} heals for ${roll}!`);
      }

      // negate special attacks
      if (this.$parent.ogrePushing >= 1) {
        this.$parent.ogrePushing -= 1;
        this.$parent.combatLog.push(`${this.toon.name} steadies!`);
      }
      if (this.$parent.dragonPushing >= 1) {
        this.$parent.dragonPushing -= 1;
        this.$parent.combatLog.push(`${this.toon.name} steadies!`);
      }

      this.$emit("action", false);
    },
    preach(input) {
        this.toon.defending = false;
        this.$emit("action", input);
        
    },
    meditate() {
        this.$parent.combatLog.push(`<span class="yellow--text fontshadow"><b">${this.toon.name}</b> says: ` + this.toon.lines[0] + '</span>');
        this.defend();
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
  },
};
</script>

<style scoped>
.toon-title {
  color: goldenrod;
}
.goldenrod-bg {
  background: goldenrod;
  height: 1000px;
}

.attack-bg {
  background: linear-gradient(
    120deg,
    rgba(202, 189, 3, 0.95) -60%,
    rgba(196, 54, 54, 0.95) 30%
  );
}
.defend-bg {
  background: linear-gradient(
    105deg,
    rgba(196, 54, 54, 0.95) 20%,
    rgba(3, 39, 107, 0.9) 75%
  );
}
.disbld {
  background: grey;
  font-size: 0;
}
</style>
