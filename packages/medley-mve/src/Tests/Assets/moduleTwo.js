System.register([], (_export) => ({
    execute() {
      _export('default', function(cntx){return "ModuleTwo response"});
      _export('notDefault', function(cntx){return "ModuleTwo response from non default export"});
    }
  }));