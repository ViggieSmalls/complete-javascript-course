'use strict';

class Car {
  constructor(name, speed) {
    this.name = name
    this.speed = speed
  }
  accelerate() {
    this.speed += 10
    console.log(this.speed)
  }
  break() {
    this.speed -= 5
    console.log(this.speed)
  }
}

const car1 = new Car('BMW', 120)
const car2 = new Car('Mercedes', 95)

car1.accelerate()
car1.accelerate()
car1.accelerate()
car2.break()
car2.break()
car2.break()