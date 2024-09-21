import { Component } from "./component";

interface WaitForSecondsTask {
	resolve: () => void;
	timeLeft: number;
}

interface WaitForPredicateTask {
	resolve: () => void;
	predicate: () => boolean;
}

export class Scheduler extends Component {
	private waitForSecondsTasks: WaitForSecondsTask[] = [];
	private waitForPredicateTasks: WaitForPredicateTask[] = [];

	public override update(dt: number): void {
		{
			const completedTasks: WaitForSecondsTask[] = [];
			for (const waitForSecondTask of this.waitForSecondsTasks) {
				waitForSecondTask.timeLeft -= dt;
				if (waitForSecondTask.timeLeft <= 0) {
					completedTasks.push(waitForSecondTask);
				}
			}

			for (const completedTask of completedTasks) {
				completedTask.resolve();
				this.waitForSecondsTasks.filter((x) => x !== completedTask);
			}
		}

		{
			const completedTasks: WaitForPredicateTask[] = [];
			for (const waitForPredicateTask of this.waitForPredicateTasks) {
				if (waitForPredicateTask.predicate()) {
					completedTasks.push(waitForPredicateTask);
				}
			}

			for (const completedTask of completedTasks) {
				completedTask.resolve();
				this.waitForPredicateTasks.filter((x) => x !== completedTask);
			}
		}
	}

	public waitForSeconds(seconds: number): Promise<void> {
		return new Promise<void>((resolve) => {
			this.waitForSecondsTasks.push({
				resolve: resolve,
				timeLeft: seconds,
			});
		});
	}

	public waitForPredicate(predicate: () => boolean): Promise<void> {
		return new Promise<void>((resolve) => {
			this.waitForPredicateTasks.push({
				resolve: resolve,
				predicate: predicate,
			});
		});
	}
}
