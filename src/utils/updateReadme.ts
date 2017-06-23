import { spawnSync } from "child_process";
import { mkdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from "fs";
import { resolve } from "path";

class UpdateReadme {
  public exp = /```(?:java|type)script([\s\S]+?)```/g;
  public readme = "";
  public filenames = [] as string[];
  public updatedExamples = [] as string[];
  public package: {
    main: string,
    name: string,
  };

  constructor(public projectRoot = resolve(__dirname + "/../..")) {
  }

  public run() {
    this.readPackage();
    this.loadReadme();
    this.writeExampleFiles();
    this.lintFix();
    this.readExamplesFromFiles();
    this.saveReadme();
    return true;
  }

  public readPackage() {
    const packageJson = readFileSync(this.projectRoot + "/package.json", "utf-8");
    this.package = JSON.parse(packageJson);
  }

  public loadReadme() {
    this.readme = readFileSync(this.projectRoot + "/README.md", "utf-8");
  }

  public writeExampleFiles() {
    // mkdirSync(this.projectRoot + "/src/example");
    const importExp = new RegExp(`from "${this.package.name}";`, "gi");

    for (const example of this.readme.match(this.exp)) {
      let lines = example.split("\n").slice(1, -1);

      lines = lines.map((line) => {
        return line.replace(importExp, `from "${this.getMainPath()}";`);
      });

      const filename = lines[0].replace(/^\/\/ /, "");
      // writeFileSync(this.projectRoot + "/" + filename, lines.join("\n"), "utf-8");
      this.filenames.push(filename);
    }
  }

  public lintFix() {
    const { status } = spawnSync("yarn", ["lint-fix"], {
      cwd: this.projectRoot,
      encoding: "utf-8",
      stdio: ["inherit", "inherit", "inherit"],
    });

    if (status !== 0) {
      process.exit(status);
    }
  }

  public readExamplesFromFiles() {
    const importExp = new RegExp(`from "${this.getMainPath()}";`, "gi");

    for (const filename of this.filenames) {
      let updatedExample = readFileSync(this.projectRoot + "/" + filename, "utf-8");
      updatedExample = updatedExample.replace(importExp, `from "${this.package.name}";`);
      this.updatedExamples.push(updatedExample);
    }
  }

  public saveReadme() {
    let i = 0;

    const updatedReadme = this.readme.replace(this.exp, () => {
      if (this.filenames[i].endsWith(".js")) {
        return "```javascript\n" + this.updatedExamples[i++] + "\n```";
      } else {
        // Tslint adds newline.
        return "```typescript\n" + this.updatedExamples[i++] + "```";
      }
    });

    writeFileSync(this.projectRoot + "/README.md", updatedReadme, "utf-8");
  }

  public getMainPath() {
    return "..";

    // May be useful:
    // import { join, relative } from "path";
    // return join(relative(__dirname, this.projectRoot), this.package.main);
  }
}

new UpdateReadme().run();
