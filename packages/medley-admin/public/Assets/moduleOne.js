System.register([], (_export) => ({
    execute() {
      _export('default', async function(cntx)
      {
        const config = cntx.model.value;
        const res = await cntx.viewEngine.renderModel(config.childModel);
        return "Child module return value: " + res;
      });
      _export('notDefault', function(cntx){return "ModuleTwo response from non default export"});
    }
  }));