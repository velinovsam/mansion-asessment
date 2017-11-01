<?php
/**
 * Problem #3: OOP
 * Please write a class structure (in the language of your choosing, such as: C#, JAVA, JavaScript, PHP)
 * that describes the following objects and their properties/functions.
 * Dolphin
 *     Age (property)
 *     Sleep (function that prints ‘Zzzzzzz’)
 *     Swim (function that prints ‘Splah’)
 *     Eat (function that prints ‘Num num num’)
 * Lion
 *     Age (property)
 *     Sleep (function that prints ‘Zzzzzzz’)
 *     Roar (function that prints ‘Rahhhh!’)
 *     Attack (function that prints ‘POW!’)
 *     Eat (function that prints ‘Num num num)
 * Eagle
 *     Age (property)
 *     Sleep (function that prints ‘Zzzzzzz’)
 *     Fly (function that prints ‘whoo Hooo!’)
 *     Attack (function that prints ‘POW!’)
 *     Eat (function that prints ‘Num num num)
 * Bee
 *     Age (property)
 *     Sleep (function that prints ‘Zzzzzzz’)
 *     Fly (function that prints ‘Whoo Hooo!’)
 *     Eat (function that prints ‘Num num num)

 */

abstract class Animal {
    protected $age;

    public function sleep() {
        echo('Zzzzzzz');
    }

    public function eat() {
        echo('Num num num');
    }
}

trait CanAttack {
    public function attack() {
        echo('POW!');
    }
}


trait CanFly {
    public function fly() {
        echo('Whoo Hooo!');
    }
}

class Dolphin extends Animal {

    public function swim() {
        echo('Splah');
    }

}

class Lion extends Animal {

    use CanAttack;

    public function roar() {
        echo('Rahhhh');
    }
}

class Eagle extends Animal {
    use CanAttack, CanFly;
}

class Bee extends Animal {
    use CanFly;
}
