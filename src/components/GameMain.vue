<template>
  <v-container>
    <v-row>
      <v-col> </v-col>
    </v-row>

    <v-row>
      <v-col v-for="m in encounter" v-bind:key="m.id">
        <monster :monster="m"></monster>
      </v-col>

      <v-spacer v-if="encounter.length == 1 && !finalBattle"></v-spacer>
    </v-row>

    <v-row>
      <v-col>
        <game-stage
          :textColor="displayTextColor"
          :text="displayText"
          :combatLog="combatLog"
          :outOfCombat="outOfCombat"
          :bossCondition="bossCondition"
          @continue="nextStage"
          @bossStage="bossStage"
        ></game-stage>
      </v-col>
      <v-col>
        <div
          :style="`top: ${ogrePushCurve}%; top: ${dragonPushCurve}%; right: ${dragonPushCurve}%`"
          v-bind:class="{
            pushable: ogrePushing || dragonPushing,

          }"
        >
          <game-char
            :toon="toon"
            :bgActive="bgActive"
            :equip="equip"
            :inventory="inventory"
            :gameOver="gameOver"
            :ogrePushing="ogrePushing"
            @action="gameRound"
            @lockMove="lockMove = true"
          ></game-char>
        </div>
      </v-col>
    </v-row>
    <v-row v-for="e in 100" v-bind:key="e">
      <br />
    </v-row>
    <v-row v-if="isSecretClub && stage<=6" class="white--text">
      {{ secretMessage }} <v-spacer></v-spacer
      ><v-btn small outlined @click="secretClub">Club</v-btn
      ><v-spacer></v-spacer
    ></v-row>
        <v-row v-if="isSecretFalchion && stage>=7" class="white--text">
      {{ secretMessage }} <v-spacer></v-spacer
      ><v-btn small outlined @click="secretFalchion">Falchion</v-btn
      ><v-spacer></v-spacer
    ></v-row>
  </v-container>
</template>

<script>
import GameStage from "../components/GameStage";
import GameChar from "../components/GameChar";
import Monster from "../components/Monster";

export default {
  components: {
    GameStage,
    GameChar,
    Monster,
  },
  props: {
    toon: Object,
  },
  computed: {
    ogrePushCurve() {
      let curveStart = 10;
      return curveStart + this.ogrePushing * 5;
    },
    dragonPushCurve() {
      let curveStart = 10;
      return curveStart + this.ogrePushing * 5;
    },
    secretMessage() {
      return this.stage<=6 ? this.secretClubMsg : this.secretFalchionMsg;
    },
    halfTimeout() {
      return this.timeout/2;
    }
  },
  data() {
    return {
      gameOver: false,
      displayTextColor: "",
      bgActive: "",
      displayText: "",
      combatLog: [],
      lockMove: false,
      timeout: 3000,
      stage: 0,
      target: null,
      encounter: [],
      xpSlope: 20,
      outOfCombat: false,
      inventory: [{ name: "Unarmed", ap: 5 }],
      equip: null,
      monsterTag: 200,
      bossCondition: false,
      finalBattle: false,
      isSecretClub: true,
      isSecretFalchion: true,
      secretClubMsg: "Hey, there's a club down here!",
      secretFalchionMsg: "Ooh, a falchion!",

      dragonPushing: 0,
      ogrePushing: 0,

      // toon: {
      //   name: "Rambo",
      //   level: 1,
      //   xp: 0,
      //   points: 110,
      //   gold: 0,
      //   hp: null,
      //   ac: null,
      //   ap: null,
      //   selectedWeapon: null,

      //     defending: false,
      //     recovering: false,
      //     sacrifice: false,
      //     lust: false,
      

      //   strength: 8,
      //   dexterity: 6,
      //   willpower: 4,
      //   vigor: 5,
      // },

      monsters: [
        {
          background: "background: linear-gradient(90deg, rgba(2,0,36,0.95) 0%, rgba(8, 21, 63, 0.95) 24%, rgba(9, 20, 121, 0.95) 66%)",
          name: "Goblin",
          xp: 10,
          gold: 150,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          damage: null,

            defending: false,
            recovering: false,

          strength: 20,
          dexterity: 1,
          willpower: 0,
          vigor: 11,
        },
        {
          background: "background: linear-gradient(90deg, rgba(9, 12, 0, 0.95) 0%, rgba(25, 36, 5, 0.95) 24%, rgba(101, 121, 9, 0.95) 66%)",
          name: "Bugbear",
          xp: 30,
          gold: 200,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          damage: null,

            defending: false,
            recovering: false,

          strength: 25,
          dexterity: 8,
          willpower: 0,
          vigor: 12,
        },
        {
          background: "background: linear-gradient(90deg, rgba(29, 37, 2, 0.95) 0%, rgba(102, 139, 31, 0.95) 33%, rgba(121, 63, 9, 0.95) 80%)",
          name: "Ogre",
          xp: 40,
          gold: 250,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          damage: null,
            defending: false,
            recovering: false,
          strength: 30,
          dexterity: 12,
          willpower: 1,
          vigor: 13,
        },
        {
          background: "background: linear-gradient(120deg, rgba(2, 2, 1, 0.95) 10%, rgba(139, 101, 31, 0.95) 33%, rgba(121, 9, 9, 0.95) 80%)",
          name: "Darkeater Midir",
          xp: 9999,
          gold: 9999,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          damage: null,
            defending: false,
            recovering: false,
          strength: 60,
          dexterity: 40,
          willpower: 10,
          vigor: 100,
        },
      ],
    };
  },

  methods: {
    gameRound(damage) {
      // init
      if (!this.target) {
        this.target = this.encounter[0];
      }
      this.lockMove = true;
      this.timeout = 3000;

      this.lock();

      // Player goes first
      this.resolveAction(damage, this.toon, this.target);
      this.endTurn();

      // then monsters
      this.encounter.forEach((monster) => {
        this.monsterTurn(monster);
        this.timeout += 3000;
        this.endTurn();
      });
    },
    monsterTurn(monster) {
      setTimeout(() => {
        monster.active = true;
        monster.defending = false;

        let monsterIndex = this.encounter.indexOf(monster);
        if (monsterIndex > 0) {
          this.encounter[monsterIndex - 1].active = false;
        }

        let rollAction = Math.floor(Math.random() * 20);

        let damage = 0;
        // check if  recovering
        if (monster.recovering) {
          damage = -1;
          // under 6 is defending
        } else if (rollAction < 6) {
          monster.defending = true;

          // heal
          let rollHeal = this.rollDamage(monster.willpower);
          if (rollHeal) {
            monster.hp += rollHeal;
            this.combatLog.push(`${monster.name} heals for ${rollHeal}!`);
          }
          // a 20 is max damage
        } else if (rollAction > 16 && rollAction <= 20) {
          if (this.finalBattle) {
            monster.recovering = true;
            this.combatLog.push(`${monster.name}: <span class="red--text fontshadow">FUS</span> <span class="blue--text fontshadow">ROH</span> <span class="yellow--text fontshadow">DAH!!</span>`);
            // -2 is special
            damage = -2;

            if (this.toon.defending) {
              this.combatLog.push(
                `${this.toon.name} is <b>braced</b> for impact and doesn't budge!`
              );
            } else {
              this.dragonPushing += 1;
            }
          } else if (monster.name == "Ogre") {
            monster.recovering = true;
            this.combatLog.push(`${monster.name} <b>pushes</b> ${this.toon.name}!`);
            // -2 is special
            damage = -2;

            if (this.toon.defending) {
              this.combatLog.push(
                `${this.toon.name} is <b>braced</b> for impact and doesn't budge!`
              );
            } else {
              this.ogrePushing += 1;
            }
          } else {
           // roll damage
          damage = this.rollDamage(monster.ap);
          }
        } else if (rollAction == 20) {
          damage = monster.ap;
        } else {
          // roll damage
          damage = this.rollDamage(monster.ap);
        }

        // needs a check because of setTimeouts
        if (monster.hp != 0) {
          this.resolveAction(damage, monster, this.toon);
        }

        console.log(this.timeout + "timeout");
      }, this.timeout);
    },
    resolveAction(damage, wielder, victim) {
      // check if recover, special, defend or attack
      if (damage == -1) {
        this.combatLog.push(`${wielder.name} is catching his breath...`);
        wielder.recovering = false;
      } else if (damage == -2) {
        // special
      } else if (wielder.defending && this.encounter.length) {
        this.combatLog.push(`${wielder.name} <span class="red--text fontshadow">defends</span>!`);
        this.displayTextColor = "defend-bg";
      } else {
        console.log(victim.ac + "ac");
        damage -= victim.ac;
        console.log(damage + " damage");

        // If damage is less than 0, make it 0
        // Apply defense if true
        damage < 0
          ? (damage = 0)
          : victim.defending
          ? (damage -= Math.floor((damage / 100) * 25))
          : damage;
        console.log(
          damage + ` after defending (defending = ${victim.defending})`
        );

        // Update descriptions
        this.displayTextColor = "attack-bg";
        damage
          ? this.combatLog.push(
              `${wielder.name} <b>attacks</b> ${victim.name} for <span class="red--text fontshadow">${damage}</span>`
            )
          : this.combatLog.push(
              `${wielder.name} <b>misses</b> ${victim.name} and deals <b>no</b> damage!`
            );

        victim.hp - damage <= 0 ? (victim.hp = 0) : (victim.hp -= damage);
      }
      this.displayText = this.combatLog.slice().reverse()[0];
      if (victim.hp == 0) {
        this.hollow(victim);
      }
    },
    endTurn() {
      setTimeout(() => {
        this.displayTextColor = "";

        this.displayText = "";
      }, this.timeout - 100);
    },
    lock() {
      setTimeout(() => {
        this.lockMove = false;
        this.displayText = "";
        this.encounter.forEach((monster) => {
          monster.active = false;
        });
      }, this.encounter.length * 4000);
    },
    checkWin() {
      if (!this.encounter.length) {
        this.displayText = "Victory!";
        this.outOfCombat = true;
        this.lockMove = true;

        // lust wears off
        this.toon.lust = false;

        //reward
        this.toon.gold += this.stage * 50;
      }
    },
    hollow(victim) {
      if (victim.level) {
        if (this.toon.sacrifice) {
          this.combatLog.push(`The <i>Ring of Sacrifice</i> <b>breaks</b>. You cheat death!`);
          this.toon.sacrifice = false;
          // heal
          this.toon.hp += this.toon.vigor * 5;
        } else {
           this.gameOver = true;
           this.lockMove = true;
        }
      } else {
        setTimeout(() => {
          this.combatLog.push(`${victim.name} is <span class="red--text fontshadow">dead</span>!`);
          this.encounter.splice(this.encounter.indexOf(victim), 1);

          // autotarget
          this.target = this.encounter[0];

          // reward
          this.toon.xp += this.rollDamage(this.toon.willpower);
          this.toon.xp += victim.xp;
          let rollGold = this.rollDamage(victim.gold);
          this.toon.gold += rollGold;
          this.combatLog.push(`${this.toon.name} gained <span class="blue--text fontshadow">${victim.xp}xp</span>`);
          this.combatLog.push(`${this.toon.name} gained <span class="yellow--text fontshadow">${rollGold}g</span>`);

          this.kindling();
          this.checkWin();
        }, this.halfTimeout);
      }
    },
    kindling() {
      if (this.toon.xp >= this.xpSlope) {
        this.toon.level += 1;
        // [1/2] bossconditions
        if (this.toon.level >= 2) {
          this.bossCondition = true;
        }
        this.toon.points += 4;
        this.xpSlope *= 1.5;
        this.combatLog.push(`${this.toon.name} gained a <span class="blue--text fontshadow">level</span>!`);
        // heal player
        this.toon.hp += this.toon.willpower + 5;
      }
    },
    bossStage() {
      // init
      this.outOfCombat = false;
      this.finalBattle = true;
      this.combatLog = [];
      this.displayText = "The Final Battle!";
      this.lockMove = false;
      this.dragonPushing = 0;
      this.ogrePushing = 0;

      // heal player
      this.toon.hp = this.toon.vigor * 10;

      this.seedEncounter(1, 3);
    },
    nextStage() {
      // init
      this.stage += 1;

      this.outOfCombat = false;
      this.combatLog = [];
      this.displayText = "";
      this.lockMove = false;
      this.dragonPushing = 0;
      this.ogrePushing = 0;

      // [1/2] bossconditions
      if (this.stage >= 10) {
        this.bossCondition = true;
      }

      this.$emit("nextStage", this.stage);

      // heal player
      if (this.toon.hp + this.toon.vigor * 1 > this.toon.vigor * 10) {
        this.toon.hp = this.toon.vigor * 10;
      } else {
        this.toon.hp += this.toon.vigor * 1;
      }

      // seedEncounter(howMany, index of monster)
      // 0 goblin | 1 bugbear | 2 ogre | 3 midir

      if (this.stage == 1) {
        this.seedEncounter(2, 0);
      } else if (this.stage < 4) {
        this.seedEncounter(3, 0);
      } else if (this.stage < 6) {
        if (this.rollDamage(20) < 15) {
          this.seedEncounter(1, 0);
          this.seedEncounter(1, 1);
        } else {
          this.seedEncounter(2, 0);
          this.seedEncounter(1, 1);
        }
      } else if (this.stage < 8) {
        if (this.rollDamage(20) < 15) {
          this.seedEncounter(2, 0);
          this.seedEncounter(1, 1);
        } else {
          this.seedEncounter(1, 0);
          this.seedEncounter(2, 1);
        }
      } else {
        if (this.rollDamage(20) < 15) {
          this.seedEncounter(1, 1);
          this.seedEncounter(1, 2);
        } else {
          this.seedEncounter(1, 2);
        }
      }
    },
    seedEncounter(howMany, index) {
      for (let i = 0; i < howMany; i++) {
        // create new monster
        let monster = Object.assign({}, this.monsters[index]);

        // scale attributes
        monster.strength += this.stage / 2;
        monster.dexterity += this.stage / 2;
        monster.willpower += this.stage / 2;
        monster.vigor += this.stage / 2;

        // assign unique id
        this.monsterTag += 1;
        var tagOn = {
          id: this.monsterTag,
        };
        monster = Object.assign(monster, tagOn);
        // push
        this.encounter.push(monster);
      }
    },
    secretClub() {
      let okay = true;
      this.inventory.forEach((weapon) => {
        if (weapon.name == "Club") {
          this.secretMessage = "Can't carry <b>two</b> of these!";
          okay = false;
          return;
        }
      });
      if (okay) {
        this.secretMessage = "";
        this.inventory.push({
          name: "Club",
          ap: 15,
          uses: 12,
          maxUses: 12,
          cost: 50,
        });
        this.isSecretClub = false;
      }
    },
    secretFalchion() {
      let okay = true;
      this.inventory.forEach((weapon) => {
        if (weapon.name == "Falchion") {
          this.secretMessage = "Can't carry <b>two</b> of these!";
          okay = false;
          return;
        }
      });
      if (okay) {
        this.secretMessage = "";
        this.inventory.push({name: "Falchion", ap: 35, uses: 3, maxUses: 3, cost: 225 });
        this.isSecretFalchion = false;
      }
    },

    rollDamage(n) {
      let r = Math.floor(Math.random() * Math.floor(n));
      r < n / 2 ? (r = Math.floor(n / 2)) : r;
      // lowest roll is half of ap
      return r;
    },
    percent(percent, hp) {
      return (hp / 100) * percent;
    },

  },
  created() {
    this.nextStage();
  },
};
</script>

<style>

.fontshadow {
  text-shadow: 1px 2px black;
}

.pushable {
  position: absolute;
  width: 30%;
}

.dragonPush {
  position: absolute;
  top: 10%;
  right: 10%;
  transition: 1;
}
.dragonPush2 {
  position: absolute;
  top: 15%;
  right: -11%;
  transition: 1;
}
.dragonPush3 {
  position: absolute;
  top: 18%;
  right: -25%;
  transition: 1;
}
.dragonPush4 {
  position: absolute;
  top: 20%;
  right: -30%;
  transition: 1;
}
.overflowhidden {
  overflow: hidden;
}
</style>
