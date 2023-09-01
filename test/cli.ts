import process from "node:process";
import anyTest, { type TestFn } from "ava";
import { Semaphore, type Permit } from "@shopify/semaphore";
import { execa } from "execa";
import { getBinPath } from "get-bin-path";
import { isExecutable } from "is-executable";

const test = anyTest as TestFn<{
	binPath: string;
	permit: Permit;
}>;

test.before("setup context", async t => {
	const binPath = await getBinPath();
	t.truthy(binPath, "No bin path found!");

	t.context.binPath = binPath!.replace("dist", "src").replace(".js", ".ts");
	t.true(await isExecutable(t.context.binPath), "Source binary not executable!");
});

// https://github.com/avajs/ava/discussions/3177
const semaphore = new Semaphore(Number(process.env["concurrency"]) || 5);

test.beforeEach("setup concurrency", async t => {
	t.context.permit = await semaphore.acquire();
});

test.afterEach.always(async t => {
	await t.context.permit.release();
});

const verifyCli = test.macro(async (t, args: string[]) => {
	const { stdout: output, exitCode } = await execa(t.context.binPath, args);

	const assertions = await t.try(tt => {
		tt.log("args:", args);
		tt.snapshot(output);
		tt.is(exitCode, 0);
	});

	assertions.commit({ retainLogs: !assertions.passed });
});

for (const flag of ["", "--help", "-h"]) {
	const suffix = flag ? `- ${flag}` : "";
	const args = flag ? [flag] : undefined;

	test(`shows help ${suffix}`, verifyCli, args!);
}

test("shows aliases for single language", verifyCli, ["markdown"]);
test("only shows language name if no aliases", verifyCli, ["css"]);
test("shows error for unknown language, does not throw", verifyCli, ["asdf"]);
test("shows language and aliases for an alias", verifyCli, ["md"]);
test("supports aliases with dashes", verifyCli, ["npm-config"]);
test("is case-insensitive", verifyCli, ["MARKDOWN"]);
test("converts spaces to dashes", verifyCli, ["NPM Config"]);
test("supports multiple languages", verifyCli, ["markdown", "javascript"]);
test("allows mixed languages and aliases as input", verifyCli, ["mArkdOwn", "JS", "NPM CoNfiG", "ASDF"]);
