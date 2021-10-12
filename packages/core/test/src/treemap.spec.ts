import { TreeMap } from "../../src";

describe("treemap", function () {
  it("can add and retrieve a value", function () {
    const treemap = new TreeMap<string>();
    treemap.setNodeValue("test", "1");
    const testVal = treemap.getNodeValue("1");
    expect(testVal).toBe("test");
  });
  it("can add and retrieve a value at depth of 2", function () {
    const treemap = new TreeMap<string>();
    treemap.setNodeValue("test", "1", "2");
    const testVal = treemap.getNodeValue("1", "2");
    expect(testVal).toBe("test");
  });
  it("can add and retrieve", function () {
    const treemap = new TreeMap<string>();
    treemap.setNodeValue( "asd", "root", "typeOnePortOne", "nodeOne", "nodeTwo");
    const testVal = treemap.getFromPath(true, "root", "typeOnePortOne", "nodeOne");
    expect(testVal).toStrictEqual(["asd"]);
  });
  it("can add multiple values and retrieve specific", function () {
    const treemap = new TreeMap<string>();
    treemap.setNodeValue("aa", "1", "a");
    treemap.setNodeValue("bb", "1", "b");
    treemap.setNodeValue("cc", "1", "c");
    treemap.setNodeValue("dd", "1", "d");
    const testVal = treemap.getNodeValue("1", "c");
    expect(testVal).toBe("cc");
  });
  it("can add multiple values with nested path", function () {
    const treemap = new TreeMap<string>();
    treemap.setNodeValue("aa", "1", "2", "a");
    treemap.setNodeValue("bb", "1", "2", "b");
    treemap.setNodeValue("cc", "1", "2", "c");
    treemap.setNodeValue("dd", "1", "2", "d");
    const testVal = treemap.getNodeValue("1", "2", "c");
    expect(testVal).toBe("cc");
  });
  it("can add multiple values at different levels", function () {
    const treemap = new TreeMap<string>();

    treemap.setNodeValue("aa", "root", "a");
    const testaa = treemap.getNodeValue("root", "a");
    expect(testaa).toBe("aa");

    treemap.setNodeValue("bb", "root", "a", "b");
    const testbb = treemap.getNodeValue("root", "a", "b");
    expect(testbb).toBe("bb");

    treemap.setNodeValue("cc", "root", "a", "b", "c");
    const testcc = treemap.getNodeValue("root", "a", "b", "c");
    expect(testcc).toBe("cc");

    treemap.setNodeValue("dd", "root", "a", "b", "d");
    const testdd = treemap.getNodeValue("root", "a", "b", "d");
    expect(testdd).toBe("dd");
  });
  it("can get all values", function () {
    const treemap = new TreeMap<string>();
    treemap.setNodeValue("aa", "1", "2");
    treemap.setNodeValue("bb", "1", "2", "3");
    treemap.setNodeValue("cc", "1", "2", "3", "c");
    treemap.setNodeValue("dd", "1", "2", "3", "d");
    const all = treemap.getAll();
    expect(all?.length).toBe(4);
  });
  it("can get values from path recursive", function () {
    const treemap = new TreeMap<string | null>();

    treemap.setNodeValue("a", "1", "2");
    treemap.setNodeValue(null, "1", "2", "3");
    treemap.setNodeValue("acd", "1", "2", "3", "5");
    treemap.setNodeValue("ace", "1", "2", "3", "6");
    treemap.setNodeValue("ab", "1", "2", "4");
    treemap.setNodeValue("abf", "1", "2", "4", "7");
    treemap.setNodeValue("abg", "1", "2", "4", "8");

    const dir1 = treemap.getFromPath(true, "1");
    expect(dir1).toEqual(expect.arrayContaining(["a", "acd", "ace", "ab", "abf", "abg"]));

    const dir3 = treemap.getFromPath(true, "1", "2", "3");
    expect(dir3).toEqual(expect.arrayContaining(["acd", "ace"]));

    const dir4 = treemap.getFromPath(true, "1", "2", "4");
    expect(dir4).toEqual(expect.arrayContaining(["ab", "abf", "abg"]));
  });
  it("can delete a path", function () {
    const treemap = new TreeMap<string | null>();
    treemap.setNodeValue("a", "1", "2");
    treemap.setNodeValue(null, "1", "2", "3");
    treemap.setNodeValue("b", "1", "2", "3", "5");
    treemap.setNodeValue("c", "1", "2", "3", "6");
    treemap.setNodeValue(null, "1", "2", "4");
    treemap.setNodeValue("e", "1", "2", "4", "7");
    treemap.setNodeValue("f", "1", "2", "4", "8");

    treemap.deleteNode("1", "2", "3");

    const nodesValAt3 = treemap.getFromPath(true, "1", "2", "3");
    expect(nodesValAt3).toEqual([]);

    const nodesValAt4 = treemap.getFromPath(true, "1", "2", "4");
    expect(nodesValAt4).toEqual(expect.arrayContaining(["e", "f"]));
  });  
  it("delete a path that doesn't exists", function () {
    const treemap = new TreeMap<string | null>();
    treemap.setNodeValue("a", "1", "2");
    treemap.setNodeValue(null, "1", "2", "3");
    treemap.setNodeValue("b", "1", "2", "3", "5");
    treemap.setNodeValue("c", "1", "2", "3", "6");
    treemap.setNodeValue(null, "1", "2", "4");
    treemap.setNodeValue("e", "1", "2", "4", "7");
    treemap.setNodeValue("f", "1", "2", "4", "8");

    treemap.deleteNode("1", "2", "z");

    const nodesValAt3 = treemap.getFromPath(true, "1", "2", "3");
    expect(nodesValAt3).toEqual(expect.arrayContaining(["b", "c"]));

    const nodesValAt4 = treemap.getFromPath(true, "1", "2", "4");
    expect(nodesValAt4).toEqual(expect.arrayContaining(["e", "f"]));
  }); 
  it("delete root path", function () {
    const treemap = new TreeMap<string | null>();
    treemap.setNodeValue("a", "1", "2");
    treemap.setNodeValue(null, "1", "2", "3");
    treemap.setNodeValue("b", "1", "2", "3", "5");
    treemap.setNodeValue("c", "1", "2", "3", "6");
    treemap.setNodeValue(null, "1", "2", "4");
    treemap.setNodeValue("e", "1", "2", "4", "7");
    treemap.setNodeValue("f", "1", "2", "4", "8");

    treemap.deleteNode("1");

    const dir1 = treemap.getFromPath(true, "1");
    expect(dir1).toEqual([]);

    const dir3 = treemap.getFromPath(true, "1", "2", "3");
    expect(dir3).toEqual([]);

    const dir4 = treemap.getFromPath(true, "1", "2", "4");
    expect(dir4).toEqual([]);
  });     
});
