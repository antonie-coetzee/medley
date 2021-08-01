import { Medley, MedleyOptions, Type, TypeCollection } from "medley";
import {
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import React from "react";

const typeNameSpace = "type";
const collectionsKey = `${typeNameSpace}-collections`;

const VALUE_SCHEMA = "valueSchema";
const EDIT_COMPONENT = "EditComponent";
const UI_SCHEMA = "uiSchema";

type typeCollectionEntry = { url?: string } & TypeCollection;

export class TypeStore {
  typeCollections: Map<string, typeCollectionEntry> = new Map();

  constructor(private medley: Medley, private typeMap: Map<string, Type>) {
    makeObservable(this, {
      typeCollections: observable.shallow,
      types: computed,
    });
    this.loadTypeCollections();
  }

  getValueSchema(typeName: string) {
    return this.medley.getExportFromType<string>(typeName, VALUE_SCHEMA);
  }

  getEditComponent(typeName: string) {
    return this.medley.getExportFromType<React.FC>(typeName, EDIT_COMPONENT);
  }

  getUiSchema(typeName: string) {
    return this.medley.getExportFromType<string>(typeName, UI_SCHEMA);
  }

  getTypesFromCollections() {
    return Array.from(this.typeCollections.values()).flatMap((v) =>
      v.map((t) => {
        return {
          name: t.name,
          ...t.current,
        };
      })
    );
  }

  loadTypeCollections() {
    const collections = localStorage.getItem(collectionsKey);
    if (collections) {
      this.typeCollections = new Map(JSON.parse(collections));
    }
  }

  get types(): Type[] {
    return this.dedupeAndSortTypes([
      ...this.getTypesFromCollections(),
      ...this.typeMap.values(),
    ]);
  }

  saveTypeCollections() {
    localStorage.setItem(
      collectionsKey,
      JSON.stringify([...this.typeCollections])
    );
  }

  async addTypeCollectionFromUrl(name: string, url: string) {
    const fetchedCollection = await this.fetchTypeCollection(name, url);
    this.addTypeCollection(name, fetchedCollection.collection, url);
  }

  addTypeCollection(name: string, collection: TypeCollection, url?: string) {
    this.typeCollections.set(name, { url: url, ...collection });
  }

  async refreshTypeCollections() {
    const collectionsToRefresh: { name: string; url: string }[] = [];
    this.typeCollections.forEach((v, k) => {
      if (v.url) {
        collectionsToRefresh.push({ name: k, url: v.url });
      }
    });
    const fetches = collectionsToRefresh.map((v) =>
      this.fetchTypeCollection(v.name, v.url)
    );
    const refreshedCollections = await Promise.all(fetches);
    refreshedCollections.forEach((v) => {
      this.typeCollections.set(v.name, v.collection);
    });
  }

  private async fetchTypeCollection(name: string, url: string) {
    const response = await fetch(url);
    const collection = (await response.json()) as TypeCollection;
    return {
      name,
      collection,
    };
  }

  private dedupeAndSortTypes(types: Type[]) {
    return [...new Set(types)].sort((a, b) => a.name.localeCompare(b.name));
  }
}
