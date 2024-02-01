import * as prettier from "prettier";
import * as fs from "node:fs";

async function test(name) {
  const code = fs.readFileSync(`./test/input/${name}.md`, "utf-8");
  const output = await prettier.format(code, {
    parser: "slidev",
    plugins: ["./dist/index.js"],
  });
  fs.writeFileSync(`./test/output/${name}.md`, output);
}

if (!fs.existsSync("./test/output"))
  fs.mkdirSync("./test/output")

test("demo");
test("tricky");
