<template>
  <v-container>
    <v-row>
      <v-col> </v-col>
    </v-row>

    <v-row>
      <v-col v-for="m in encounter" v-bind:key="m.id">
        <monster :monster="m" :bgActive="bgActive"></monster>
      </v-col>

      <v-spacer v-if="encounter.length == 1 && !finalBattle"></v-spacer>
    </v-row>

    <v-row>
      <v-col>
        <game-stage
          :bgMessage="bgMessage"
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
          v-bind:class="{
            transitionPush: specialActions.pushOff == 1,
            transitionPush2: specialActions.pushOff == 2,
            transitionPush3: specialActions.pushOff == 3,
            transitionPush4: specialActions.pushOff == 4,
          }"
        >
          <game-char
            :toon="toon"
            :bgActive="bgActive"
            :equip="equip"
            :inventory="inventory"
            :gameOver="gameOver"
            @action="gameRound"
            @lockMove="lockMove = true"
          ></game-char>
        </div>
      </v-col>
    </v-row>
    <v-row v-for="e in 100" v-bind:key="e">
      <br />
    </v-row>
    <v-row v-if="isSecret" class="white--text">
      {{ secretMessage }} <v-spacer></v-spacer
      ><v-btn small outlined @click="secretClub">Club</v-btn
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
  data() {
    return {
      gameOver: false,
      bgMessage: "",
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
      isSecret: true,
      secretMessage: "Hey, there's a club down here!",

      specialActions: {
        pushOff: 0,
        recovering: false,
      },

      toon: {
        name: "Rambo",
        level: 1,
        xp: 0,
        points: 0,
        gold: 0,
        hp: null,
        ac: null,
        ap: null,
        selectedWeapon: null,

        status: {
          defending: false,
          recovering: false,
          sacrifice: false,
          lust: false,
        },

        strength: 10,
        dexterity: 8,
        willpower: 8,
        vigor: 5,
      },

      monsters: [
        {
          name: "Goblin",
          xp: 10,
          gold: 150,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
                    damage: null,
                  status: {
          defending: false,
          recovering: false,

        },
          strength: 20,
          dexterity: 1,
          willpower: 0,
          vigor: 11,
        },
        {
          name: "Bugbear",
          xp: 30,
          gold: 200,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          damage: null,
                  status: {
          defending: false,
          recovering: false,

        },
          strength: 25,
          dexterity: 8,
          willpower: 0,
          vigor: 12,
        },
        {
          name: "Ogre",
          xp: 40,
          gold: 250,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          damage: null,
                  status: {
          defending: false,
          recovering: false,

        },
          strength: 30,
          dexterity: 12,
          willpower: 1,
          vigor: 13,
        },
        {
          name: "Darkeater Midir",
          xp: 9999,
          gold: 9999,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          damage: null,
                  status: {
          defending: false,
          recovering: false,

        },
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
        monster.status.defending = false;

        let monsterIndex = this.encounter.indexOf(monster);
        if (monsterIndex > 0) {
          this.encounter[monsterIndex - 1].active = false;
        }

        let rollAction = Math.floor(Math.random() * 20);
        // check if boss is recovering

        let damage = 0;
        // check if boss is recovering
        if (this.specialActions.recovering) {
          damage = -1;
          // under 6 is defending
        } else if (rollAction < 6) {
          monster.status.defending = true;
          // heal
          let rollHeal = this.rollDamage(monster.willpower);
          if (rollHeal) {
            monster.hp += rollHeal;
            this.combatLog.push(`${monster.name} heals for ${rollHeal}!`);
          }
          // a 20 is max damage
        } else if (rollAction > 16 && rollAction <= 20 && this.finalBattle) {
          this.specialActions.recovering = true;
          this.combatLog.push(`${monster.name}: FUS ROH DAH!!`);

          if (this.toon.status.defending) {
            this.combatLog.push(
              `${this.toon.name} is braced for impact and doesn't budge!`
            );
          } else {
            this.specialActions.pushOff += 1;
          }
          // -2 is special
          damage = -2;
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
        this.combatLog.push(`${wielder.name} is catching his breath!`);
        this.specialActions.recovering = false;
      } else if (damage == -2) {
        // special
      } else if (wielder.status.defending) {
        this.combatLog.push(`${wielder.name} defends!`);
        this.bgMessage = "defend-bg";
      } else {
        console.log(victim.ac + "ac");
        damage -= victim.ac;
        console.log(damage + " damage");

        // If damage is less than 0, make it 0
        // Apply defense if true
        damage < 0
          ? (damage = 0)
          : victim.status.defending
          ? (damage -= Math.floor((damage / 100) * 25))
          : damage;
        console.log(
          damage + ` after defending (defending = ${victim.status.defending})`
        );

        // Update descriptions
        this.bgMessage = "attack-bg";
        !damage
          ? this.combatLog.push(
              `${wielder.name} misses ${victim.name} and deals no damage!`
            )
          : this.combatLog.push(
              `${wielder.name} attacks ${victim.name} for ${damage}`
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
        this.bgMessage = "";

        this.displayText = "";
      }, this.timeout - 100);
    },
    lock() {
      setTimeout(() => {
        this.lockMove = false;
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

        //reward
        this.toon.gold += this.stage * 100;
      }
    },
    hollow(victim) {
      if (victim.level) {
        if(this.toon.status.sacrifice) {
          this.combatLog.push(`The Ring of Sacrifice breaks. You cheat death!`);
          // heal
          this.toon.hp+=this.toon.vigor*5;
        }
        this.gameOver = true;
        this.lockMove = true;
      } else {
        setTimeout(() => {
          this.combatLog.push(`${victim.name} is dead!`);
          this.encounter.splice(this.encounter.indexOf(victim), 1);

          // autotarget
          this.target = this.encounter[0];

          // reward
          this.toon.xp += this.rollDamage(this.toon.willpower);
          this.toon.xp += victim.xp;
          let rollgold = this.rollDamage(victim.gold);
          this.toon.gold += rollgold;
          this.combatLog.push(`${this.toon.name} gained ${victim.xp} xp`);
          this.combatLog.push(`${this.toon.name} gained ${victim.gold} g`);

          this.kindling();
          this.checkWin();
        }, 1500);
      }
    },
    kindling() {
      if (this.toon.xp >= this.xpSlope) {
        this.toon.level += 1;
        // [1/2] bossconditions
        if (this.toon.level >= 10) {
          this.bossCondition = true;
        }
        this.toon.points += 4;
        this.xpSlope *= 1.5;
        this.combatLog.push(`${this.toon.name} gained a level!`);
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
          this.secretMessage = "Can't carry two of these!";
          okay = false;
          return;
        }
      });
      if (okay) {
        this.secretMessage = "";
        this.inventory.push({
          name: "Club",
          ap: 15,
          uses: 20,
          maxUses: 20,
          cost: 50,
        });
        this.isSecret = false;
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
.highlight {
  background-color: rgba(0, 255, 255, 0.288);
  background: rgba(0, 255, 255, 0.288);
}

.transitionPush {
  position: absolute;
  top: 10%;
  right: 10%;
  transition: 1;
}
.transitionPush2 {
  position: absolute;
  top: 15%;
  right: -11%;
  transition: 1;
}
.transitionPush3 {
  position: absolute;
  top: 18%;
  right: -25%;
  transition: 1;
}
.transitionPush4 {
  position: absolute;
  top: 20%;
  right: -30%;
  transition: 1;
}
.overflowhidden {
  overflow: hidden;
}
</style>
