import { Reducer } from "redux";
import { IWorkflowState, WorkflowTypes, AnalysisStep } from "./types";
import { merge } from "lodash";

function getInitialSteps() {
  const steps: AnalysisStep[] = [];
  steps[0] = {
    id: 1,
    title: "Create a Feed Root Node",
    status: "wait",
    error: "",
  };

  steps[1] = {
    id: 2,
    title: "Create a Feed Tree",
    status: "wait",
    error: "",
  };

  steps[2] = {
    id: 3,
    title: "Success",
    status: "wait",
    error: "",
  };
  return steps;
}

export const initialState: IWorkflowState = {
  localfilePayload: {
    files: [],
    error: "",
    loading: false,
  },

  steps: getInitialSteps(),
  currentStep: 0,
  optionState: {
    isOpen: false,
    toggleTemplateText: "Choose a Pipeline",
    selectedOption: "",
  },
  checkFeedDetails: undefined,
  pluginParameters: undefined,
  pluginPipings: undefined,
  pipelinePlugins: undefined,
  computeEnvs: undefined,
  uploadedWorkflow: "",
  currentNode: undefined,
};

const reducer: Reducer<IWorkflowState> = (state = initialState, action) => {
  switch (action.type) {
    case WorkflowTypes.SET_LOCAL_FILE: {
      return {
        ...state,
        localfilePayload: {
          ...state.localfilePayload,
          files: action.payload,
        },
      };
    }

    case WorkflowTypes.DELETE_LOCAL_FILE: {
      const files = state.localfilePayload.files.filter(
        (file) => file.name !== action.payload
      );
      return {
        ...state,
        localfilePayload: {
          ...state.localfilePayload,
          files,
        },
      };
    }
    case WorkflowTypes.SET_OPTION_STATE: {
      return {
        ...state,
        optionState: action.payload,
      };
    }

    case WorkflowTypes.SET_UPLOADED_SPEC_SUCCESS: {
      return {
        ...state,
        uploadedWorkflow: action.payload,
      };
    }

    case WorkflowTypes.SUBMIT_ANALYSIS: {
      return {
        ...state,
        isAnalysisRunning: true,
      };
    }

    case WorkflowTypes.SET_CURRENT_STEP: {
      return {
        ...state,
        currentStep: action.payload,
      };
    }

    case WorkflowTypes.SET_CURRENT_NODE: {
      if (state.computeEnvs && action.payload.currentComputeEnv) {
        const computeEnvsOptions =
          state.computeEnvs[action.payload.pluginName].computeEnvs;
        const findIndex = computeEnvsOptions?.findIndex((option) => {
          if (option.name === action.payload.currentComputeEnv) return option;
          else return 0;
        });

        let currentlySelected;
        if (computeEnvsOptions) {
          if (findIndex === computeEnvsOptions.length - 1) {
            currentlySelected = computeEnvsOptions[0];
          } else if (typeof findIndex === "number") {
            currentlySelected = computeEnvsOptions[findIndex + 1];
          }
        }

        if (currentlySelected) {
          const duplicateObject = state.computeEnvs;
          duplicateObject[action.payload.pluginName].currentlySelected =
            currentlySelected;
          return {
            ...state,
            currentNode: action.payload,
            computeEnvs: duplicateObject,
          };
        }
      }
      return {
        ...state,
        currentNode: action.payload,
      };
    }

    case WorkflowTypes.STOP_ANALYSIS: {
      return {
        ...state,
        optionState: {
          isOpen: false,
          toggleTemplateText: "Choose a Workflow",
          selectedOption: "",
          plugins: [],
        },
      };
    }

    case WorkflowTypes.SET_ANALYSIS_STEP: {
      const cloneSteps = [...state.steps];
      const index = cloneSteps.findIndex(
        (step) => step.id === action.payload.id
      );
      cloneSteps[index] = action.payload;

      if (index === 3) {
        return {
          ...state,
          steps: cloneSteps,
          currentStep: state.currentStep + 1,
        };
      } else
        return {
          ...state,
          steps: cloneSteps,
        };
    }

    case WorkflowTypes.SET_PLUGIN_PARAMETERS: {
      return {
        ...state,
        pluginParameters: action.payload,
      };
    }

    case WorkflowTypes.SET_COMPUTE_ENVS: {
      if (state.computeEnvs) {
        return {
          ...state,
          computeEnvs: merge(state.computeEnvs, action.payload),
        };
      } else
        return {
          ...state,
          computeEnvs: action.payload,
        };
    }

    case WorkflowTypes.SET_PIPELINE_PLUGINS: {
      return {
        ...state,
        pipelinePlugins: action.payload,
      };
    }

    case WorkflowTypes.SET_FEED_DETAILS: {
      return {
        ...state,
        checkFeedDetails: action.payload,
      };
    }

    case WorkflowTypes.SET_INFANT_AGE: {
      return {
        ...state,
        infantAge: action.payload,
      };
    }

    case WorkflowTypes.RESET_WORKFLOW_STEP: {
      return {
        ...initialState,
      };
    }

    case WorkflowTypes.SET_PLUGIN_PIPINGS_LIST: {
      return {
        ...state,
        pluginPipings: action.payload,
      };
    }

    case WorkflowTypes.CLEAR_FILE_SELECTION: {
      return {
        ...state,
        localfilePayload: {
          ...state.localfilePayload,
          files: [],
          error: "",
          loading: false,
        },
      };
    }

    default:
      return state;
  }
};

export { reducer as workflowsReducer };
