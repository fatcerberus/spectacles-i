/***
 * Specs Engine v6: Spectacles Saga Game Engine
  *           Copyright (c) 2017 Power-Command
***/

class MPPool
{
	constructor(id, capacity, availableMP = capacity)
	{
		this.id = id;
		this.availableMP = Math.min(availableMP, capacity);
		this.capacity = capacity;
		term.print(`create MP pool '${this.id}'`,
			`cap: ${this.capacity}`,
			`avail: ${this.availableMP}`);
		
		// handler function signature:
		//     function(pool, mpLeft)
		this.gainedMP = new events.Delegate();
		this.lostMP = new events.Delegate();
	}

	restore(amount)
	{
		amount = Math.round(amount);
		this.availableMP = Math.min(this.availableMP + amount, this.capacity);
		this.gainedMP.invoke(this, this.availableMP);
		if (amount != 0) {
			term.print(`${amount} MP restored to pool '${this.id}'`,
				`avail: ${this.availableMP}`);
		}
	}

	use(amount)
	{
		amount = Math.round(amount);
		if (amount > this.availableMP)
			throw new Error(`'${this.id}' MP overdraft`);
		this.availableMP -= amount;
		this.lostMP.invoke(this, this.availableMP);
		if (amount != 0) {
			term.print(`${Math.round(amount)} MP used from pool '${this.id}'`,
				`left: ${this.availableMP}`);
		}
	}
}
