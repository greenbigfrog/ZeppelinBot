import { PluginData } from "knub";
import { Awaitable } from "knub/dist/utils";
import * as t from "io-ts";
import { AutomodContext, AutomodPluginType } from "./types";

export interface AutomodTriggerMatchResult<TExtra extends any = unknown> {
  extraContexts?: AutomodContext[];
  extra?: TExtra;

  silentClean?: boolean; // TODO: Maybe generalize to a "silent" value in general, which mutes alert/log

  summary?: string;
  fullSummary?: string;
}

type AutomodTriggerMatchFn<TConfigType, TMatchResultExtra> = (meta: {
  ruleName: string;
  pluginData: PluginData<AutomodPluginType>;
  context: AutomodContext;
  triggerConfig: TConfigType;
}) => Awaitable<null | AutomodTriggerMatchResult<TMatchResultExtra>>;

type AutomodTriggerRenderMatchInformationFn<TConfigType, TMatchResultExtra> = (meta: {
  ruleName: string;
  pluginData: PluginData<AutomodPluginType>;
  contexts: AutomodContext[];
  triggerConfig: TConfigType;
  matchResult: AutomodTriggerMatchResult<TMatchResultExtra>;
}) => Awaitable<string>;

export interface AutomodTriggerBlueprint<TConfigType extends t.Any, TMatchResultExtra> {
  configType: TConfigType;
  defaultConfig: Partial<t.TypeOf<TConfigType>>;

  match: AutomodTriggerMatchFn<t.TypeOf<TConfigType>, TMatchResultExtra>;
  renderMatchInformation: AutomodTriggerRenderMatchInformationFn<t.TypeOf<TConfigType>, TMatchResultExtra>;
}

export function automodTrigger<TMatchResultExtra>(): <TConfigType extends t.Any>(
  blueprint: AutomodTriggerBlueprint<TConfigType, TMatchResultExtra>,
) => AutomodTriggerBlueprint<TConfigType, TMatchResultExtra>;

export function automodTrigger<TConfigType extends t.Any>(
  blueprint: AutomodTriggerBlueprint<TConfigType, unknown>,
): AutomodTriggerBlueprint<TConfigType, unknown>;

export function automodTrigger(...args) {
  if (args.length) {
    return args[0];
  } else {
    return automodTrigger;
  }
}

type AutomodActionApplyFn<TConfigType> = (meta: {
  ruleName: string;
  pluginData: PluginData<AutomodPluginType>;
  contexts: AutomodContext[];
  actionConfig: TConfigType;
  matchResult: AutomodTriggerMatchResult;
}) => Awaitable<void>;

export interface AutomodActionBlueprint<TConfigType extends t.Any> {
  configType: TConfigType;
  defaultConfig: Partial<t.TypeOf<TConfigType>>;

  apply: AutomodActionApplyFn<t.TypeOf<TConfigType>>;
}

export function automodAction<TConfigType extends t.Any>(
  blueprint: AutomodActionBlueprint<TConfigType>,
): AutomodActionBlueprint<TConfigType> {
  return blueprint;
}
