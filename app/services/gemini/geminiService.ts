import { ApiResponse, ApisauceInstance, create } from "apisauce"

import Config from "@/config"

import { getGeminiProblem } from "./geminiProblem"
import { GeminiConfig, GeminiGenerateContentResponse, GeminiSvgGeneratorKind, GeminiSvgResult } from "./types"

interface GeminiSvgGeneratorPreset {
    title: string
    subjectInstruction: string
    compositionInstruction: string
    promptNotes?: string[]
    exampleSvgs: string[]
}

const SVG_COMMENT_REGEX = /<!--\s*([\s\S]*?)\s*-->/g
const SVG_PATH_DATA_REGEX = /\sd="([^"]+)"/g

const SMILY_DOG_SVG_EXAMPLE = `<svg viewBox="0 0 100 170">
  <g id="dog-legs-and-body">
    <!-- The dog's back leg and paw -->
    <path fill="#BA703C" d="M65.584,134.817c-2.909,0.226-9.604,3.5-11.291,4.312c0.082,7.354,0.045,17.089,0.5,21.834c0.132,1.369,0.5,3.25,2.416,3.707c1.742,0.416,5.629,0.571,7.479-0.354c1.459-0.729,1.875-1.688,1.792-3.021c-0.17-2.723-2.465-4.104-2.396-4.666C64.584,152.589,65.834,143.464,65.584,134.817"/>
    <!-- The dog's front leg and paw -->
    <path fill="#BA703C" d="M34.605,134.817c2.91,0.226,9.604,3.5,11.291,4.312c-0.082,7.354-0.045,17.089-0.5,21.834c-0.131,1.369-0.5,3.25-2.416,3.707c-1.741,0.416-5.629,0.571-7.479-0.354c-1.458-0.729-1.875-1.688-1.792-3.021c0.17-2.723,2.467-4.104,2.396-4.666C35.605,152.589,34.355,143.464,34.605,134.817"/>
    <!-- The dog's right arm -->
    <path fill="#BA703C" d="M59.803,114.922c4.11,6.784,7.234,12.974,11,19.5c2.641,4.578,8.61,1.556,7.5-2.333c-1.668-5.834-9.668-20.5-18.154-25.995L59.803,114.922z"/>
    <!-- The dog's left arm -->
    <path fill="#BA703C" d="M40.093,106.094c-8.488,5.494-16.488,20.161-18.154,25.994c-1.112,3.89,4.859,6.911,7.5,2.334c3.765-6.526,6.888-12.716,11-19.5L40.093,106.094z"/>
    <!-- The dog's torso and belly mass -->
    <path fill="#BA703C" d="M62.129,106.588c-1.076,0.08-6.703,0.185-11.824,0.229c-5.123-0.045-10.75-0.149-11.824-0.229c-3.014,11.048-4.584,30.667-3.641,34.65c0.297,1.251,7.827,3.079,12.702,3.544c0.917,0.087,4.337,0.099,5.282,0.012c5.156-0.477,12.086-2.042,12.443-3.556C66.211,137.255,65.141,117.636,62.129,106.588"/>
  </g>
  <g id="dog-head-and-face">
    <!-- The dog's left ear -->
    <path fill="#7D4A21" d="M23.645,61.413c-4.186,2.529-10.961,22.042-11.323,28.637c-0.29,5.325,5.33,6.955,7.68,2.169c1.814-3.7,1.803-19.039,2.348-22.856C22.892,65.568,23.645,61.413,23.645,61.413"/>
    <!-- The dog's right ear -->
    <path fill="#7D4A21" d="M76.358,61.413c4.185,2.529,10.961,22.042,11.32,28.637c0.292,5.325-5.328,6.955-7.678,2.169c-1.814-3.7-1.802-19.039-2.348-22.856C77.111,65.568,76.358,61.413,76.358,61.413"/>
    <!-- The dog's head silhouette and muzzle base -->
    <path fill="#B9703D" d="M27.044,55.392c2.76-3.163,5.938-5.652,9.357-7.449c5.901-3.459,14.752-8.285,17.696-9.782c0.963-0.489,1.906-0.862,2.856-1.221c0.254-0.096,0.742-0.149,1.162,0.071c0.344,1.281-1.091,5.025-1.413,5.883c-0.271,0.724-0.452,0.995-0.731,1.799c2.228-0.493,4.701-1.075,7.236-1.507c0.715-0.123,1.445-0.338,2.053,0.074c-0.62,1.549-1.288,3.063-2.199,4.381c3.811,1.892,7.415,4.657,10.595,8.351c10.38,12.065,7.226,39.025-2.77,47.336c-10.972,9.119-35.292,7.949-43.723-2.049C18.226,90.683,16.952,66.952,27.044,55.392"/>
    <!-- The dog's mouth area -->
    <path fill="#FFFFFF" d="M68.866,92.683c0.295-0.811,0.742-0.927-0.241-1.184c-1.85-0.483-12.653-1.995-19.035-2.196c-6.687-0.209-15.099,0.683-18.757,1.059c-0.836,0.086-1.312,0.191-1.089,0.873c0.817,2.486,10.354,12.353,19.878,12.048C58.6,102.994,67.971,95.144,68.866,92.683"/>
    <!-- The dog's tooth separators -->
    <line stroke="#BED0CE" x1="60.746" y1="86.766" x2="60.746" y2="104.527"/>
    <line stroke="#BED0CE" x1="50.297" y1="87.955" x2="50.297" y2="105.574"/>
    <line stroke="#BED0CE" x1="39.847" y1="87.812" x2="39.847" y2="103.48"/>
    <!-- The dog's nose and muzzle shadow -->
    <path fill="#472E1F" d="M56.243,75.992c-2.724-1.69-10.6-1.986-13.55,0.241c-3.308,2.497-2.89,7.408-0.421,9.215c3.278,2.398,12.104,2.469,14.995-0.302C59.517,82.991,59.736,78.161,56.243,75.992"/>
    <!-- The dog's right eye -->
    <path fill="#482E1F" d="M62.161,72.377c0.057-4.754,1.807-6.122,3.902-6.097c2.172,0.024,3.786,1.556,3.863,6.083c0.248,0.646,2.396,0.859,2.604,0.022c0.284-2.196-0.505-8.579-6.339-8.841c-5.212-0.234-7.022,5.543-6.737,8.872C59.699,73.013,61.876,73.124,62.161,72.377"/>
    <!-- The dog's left eye -->
    <path fill="#482E1F" d="M37.624,72.377c-0.057-4.754-1.806-6.122-3.902-6.097c-2.172,0.024-3.786,1.556-3.862,6.083c-0.249,0.646-2.398,0.859-2.604,0.022c-0.284-2.196,0.505-8.579,6.339-8.841c5.211-0.234,7.022,5.543,6.736,8.872C40.087,73.013,37.909,73.124,37.624,72.377"/>
  </g>
</svg>`

const SMILY_CAT_SVG_EXAMPLE = `<svg viewBox="0 0 100 170">
  <g id="cat-legs-and-body">
    <!-- The cat's back leg and paw -->
    <path fill="#F27124" d="M64.215,134.817c-2.909,0.227-8.583,3.375-10.271,4.188c0.082,7.354,0.19,17.214,0.646,21.96c0.132,1.369,0.5,3.25,2.417,3.707c1.74,0.416,5.461,0.57,7.312-0.354c1.457-0.729,1.875-1.688,1.791-3.021c-0.17-2.723-2.465-4.105-2.396-4.666C64.215,152.59,64.694,143.412,64.215,134.817"/>
    <!-- The cat's front leg and paw -->
    <path fill="#F27124" d="M35.601,134.817c2.91,0.227,8.582,3.375,10.271,4.188c-0.083,7.354-0.19,17.214-0.646,21.96c-0.131,1.369-0.5,3.25-2.418,3.707c-1.739,0.416-5.461,0.57-7.312-0.354c-1.458-0.729-1.875-1.688-1.792-3.021c0.17-2.723,2.466-4.105,2.396-4.666C35.601,152.59,35.121,143.412,35.601,134.817"/>
    <!-- The cat's right arm -->
    <path fill="#F27124" d="M59.63,114.922c4.111,6.784,7.235,12.974,11,19.5c2.642,4.578,8.611,1.556,7.5-2.333c-1.666-5.834-9.666-20.5-18.153-25.994L59.63,114.922z"/>
    <!-- The cat's left arm -->
    <path fill="#F27124" d="M39.921,106.095c-8.488,5.494-16.488,20.16-18.154,25.994c-1.111,3.89,4.859,6.91,7.5,2.334c3.766-6.526,6.889-12.717,11-19.5L39.921,106.095z"/>
    <!-- The cat's torso and belly -->
    <path fill="#F27124" d="M60.956,106.589c-1.074,0.08-20.572,0.08-21.647,0c-3.013,11.048-3.938,30.042-3.89,34.65c0.013,1.285,6.576,3.078,11.451,3.544c0.918,0.086,5.338,0.099,6.282,0.012c5.156-0.478,11.144-2.002,11.194-3.556C64.495,136.631,63.97,117.637,60.956,106.589"/>
  </g>
  <g id="cat-head-and-face">
    <!-- The cat's right whiskers -->
    <path fill="#F27124" d="M80.796,77.593c1.427-0.131,9.81-1.412,10.312-1.996c0.503-0.584,0.023-1.825-0.646-1.993c-0.669-0.169-8.099,1.022-8.999,1.452L80.796,77.593z"/>
    <!-- The cat's upper right whiskers -->
    <path fill="#F27124" d="M81.42,75.403c1.103-0.917,7.301-6.706,7.383-7.471c0.086-0.766-1.011-1.519-1.659-1.279c-0.646,0.238-6.106,5.417-6.607,6.28L81.42,75.403z"/>
    <!-- The cat's left whiskers -->
    <path fill="#F27124" d="M19.203,77.593c-1.426-0.131-9.81-1.412-10.311-1.996c-0.505-0.584-0.023-1.825,0.645-1.993c0.669-0.169,8.101,1.022,9.002,1.452L19.203,77.593z"/>
    <!-- The cat's upper left whiskers -->
    <path fill="#F27124" d="M18.579,75.403c-1.104-0.917-7.3-6.706-7.384-7.471c-0.085-0.766,1.012-1.519,1.657-1.279c0.648,0.238,6.11,5.417,6.611,6.28L18.579,75.403z"/>
    <!-- The cat's head silhouette -->
    <path fill="#F17024" d="M82.819,77.248c0,18.728-13.95,33.444-32.677,33.444c-17.774,0-33.252-16.436-33.252-33.062c0-19.3,14.523-34.016,32.688-34.016C69.06,43.615,82.819,56.418,82.819,77.248"/>
    <!-- The cat's right ear -->
    <path fill="#F27124" d="M77.662,59.189c2.577-8.313,1.236-23.458,0.572-26.563c-0.287-1.337-2.191-2.608-4.204-1.433C71.735,32.53,61.227,45.525,60.27,49.156L77.662,59.189z"/>
    <!-- The cat's left ear -->
    <path fill="#F27124" d="M23.101,59.093c-2.579-8.313-1.238-23.456-0.573-26.562c0.288-1.337,2.19-2.609,4.206-1.434c2.291,1.338,12.803,14.333,13.757,17.964L23.101,59.093z"/>
    <!-- The cat's smile line -->
    <path fill="none" stroke="#482E1F" d="M58.973,91.846c-5.869,3.47-12.407,3.47-18.01-0.132"/>
    <!-- The cat's mouth mass -->
    <path fill="#FFFFFF" d="M57.39,89.31c-2.226,0.522-5.614,1.438-7.97,1.438s-5.722-0.916-7.948-1.438c-4.385-1.033-5.607,5.241-1.668,7.458c2.093,1.179,5.954,2.224,9.616,2.224c3.664,0,7.565-1.045,9.658-2.224C63.018,94.551,61.775,88.276,57.39,89.31"/>
    <!-- The cat's tooth separators -->
    <line stroke="#BED0CE" x1="42.116" y1="88.183" x2="42.116" y2="99.889"/>
    <line stroke="#BED0CE" x1="49.568" y1="90.463" x2="49.568" y2="99.889"/>
    <line stroke="#BED0CE" x1="57.021" y1="88.183" x2="57.021" y2="99.889"/>
    <!-- The cat's nose -->
    <path fill="#ED2E7C" d="M55.398,83.076c0,3.345-2.439,4.49-5.447,4.49c-3.007,0-5.446-1.432-5.446-4.49c0-2.866,2.439-4.49,5.446-4.49C52.959,78.586,55.398,80.306,55.398,83.076"/>
    <!-- The cat's right eye -->
    <path fill="#482E1F" d="M63.533,75.672c0.059-4.847,1.842-6.243,3.979-6.217c2.214,0.025,3.859,1.588,3.938,6.202c0.253,0.66,2.443,0.876,2.654,0.024c0.29-2.239-0.514-8.747-6.462-9.014c-5.314-0.239-7.16,5.652-6.869,9.044C61.023,76.32,63.242,76.434,63.533,75.672"/>
    <!-- The cat's left eye -->
    <path fill="#482E1F" d="M36.382,75.672c-0.059-4.847-1.842-6.243-3.98-6.217c-2.212,0.025-3.861,1.588-3.938,6.202c-0.253,0.66-2.446,0.876-2.656,0.024c-0.288-2.239,0.518-8.747,6.465-9.014c5.312-0.239,7.16,5.652,6.866,9.044C38.892,76.32,36.672,76.434,36.382,75.672"/>
  </g>
</svg>`

const BIRD_SVG_EXAMPLE = `<svg viewBox="0 0 100 170">
    <g id="bird-legs-and-body">
        <!-- The bird's right foot -->
        <path fill="#EE4E85" d="M58.639,165c-0.832,0-1.689-0.018-2.569-0.061c-0.658-0.035-1.196-0.539-1.272-1.193c-0.541-4.648-0.568-12.057-0.32-16.666c0.041-0.744,0.662-1.346,1.422-1.275c0.744,0.041,1.314,0.676,1.275,1.42c-0.225,4.133-0.222,10.553,0.187,15.061c2.024,0.049,3.937-0.033,5.657-0.105c0.736-0.037,1.375,0.545,1.406,1.291c0.032,0.744-0.545,1.373-1.291,1.406C61.748,164.936,60.241,165,58.639,165"/>
        <!-- The bird's left foot -->
        <path fill="#EE4E85" d="M41.361,165c-1.604,0-3.109-0.064-4.496-0.123c-0.744-0.033-1.322-0.662-1.291-1.406c0.033-0.746,0.675-1.334,1.408-1.291c1.721,0.072,3.635,0.156,5.656,0.105c0.408-4.508,0.411-10.928,0.188-15.061c-0.041-0.744,0.531-1.379,1.274-1.42c0.757-0.068,1.382,0.531,1.421,1.275c0.25,4.609,0.223,12.018-0.32,16.666c-0.075,0.654-0.613,1.158-1.271,1.193C43.05,164.982,42.193,165,41.361,165"/>
        <!-- The bird's right wing -->
        <path fill="#EE4E85" d="M79.967,111.531c1.825,1.527,8.92,9.941,7.713,15.986c-0.949,4.764-6.504,6.434-10.48,3.762c-3.824-2.57-6.592-10.732-5.913-16.879L79.967,111.531z"/>
        <!-- The bird's left wing -->
        <path fill="#EE4E85" d="M20.033,111.531c-1.824,1.527-8.918,9.941-7.713,15.986c0.95,4.764,6.504,6.434,10.481,3.762c3.823-2.57,6.592-10.732,5.913-16.879L20.033,111.531z"/>
        <!-- The bird's torso and belly -->
        <path fill="#BE202E" d="M18.66,101.982c3.362,0,58.972-0.062,62.584-0.062c-0.935,25.969-4.847,35.291-12.953,44.09c-3.64,3.949-10.988,5.727-18.373,5.623c-8.158-0.111-14.699-1.787-18.711-5.996C23.642,137.695,20.186,128.355,18.66,101.982"/>
    </g>
    <g id="bird-head-and-face">
        <!-- The bird's feather tuft accents -->
        <path fill="#EE4E85" d="M51.258,50.194c0.166,1.959,0.041,4.209,0.01,6.443c-0.63-0.1-1.35-0.105-2.088-0.089c0.006-1.712,0.122-4.124,0.203-6.229C49.625,49.76,50.84,49.694,51.258,50.194 M42.582,51.736c-0.158-0.792-1.574-0.375-1.74,0.261c0.166,2.031,0.707,3.947,1.218,5.662c0.596-0.279,1.312-0.433,2.004-0.61C43.562,55.286,43.008,53.361,42.582,51.736 M59.215,52.111c0.125-0.75-1.5-1.167-1.795-0.469c-0.58,1.844-0.979,3.55-1.478,5.313c0.728,0.168,1.423,0.375,2.086,0.609C58.383,55.694,59.019,54.444,59.215,52.111"/>
        <!-- The bird's round head -->
        <path fill="#ED4F85" d="M18.738,103.038c-1.399-18.342,3.357-46.914,31.339-47.193c28.931-0.289,32.675,31.71,31.059,47.193H18.738z"/>
        <!-- The bird's outer beak -->
        <path fill="#BE202E" d="M48.983,66.361c0.931-1.188,1.568-1.286,2.475-0.062c0.818,1.107,9.289,11.583,10.302,13.104c0.54,0.811,0.71,1.645,0.077,2.626c-0.772,1.198-9.936,12.291-10.802,13.254c-0.543,0.604-1.086,0.905-1.931,0.062c-1.088-1.088-10.115-12.229-10.898-13.557c-0.482-0.813-0.486-1.488,0-2.293C38.837,78.44,47.678,68.025,48.983,66.361"/>
        <!-- The bird's inner beak shadow -->
        <path fill="#482E1F" d="M49.404,71.069c0.556-0.742,1.002-0.817,1.522-0.036c0.436,0.65,6.579,8.031,7.191,8.974c0.297,0.459,0.408,0.818,0.037,1.375c-0.533,0.801-6.954,8.456-7.489,9.049c-0.334,0.371-0.668,0.557-1.188,0.037c-0.668-0.67-7.005-8.306-7.487-9.123c-0.296-0.501-0.297-0.917,0-1.412C42.379,79.284,48.672,72.047,49.404,71.069"/>
        <!-- The bird's right eye -->
        <path fill="#482E1F" d="M64.409,76.235c0.055-4.601,1.75-5.926,3.777-5.901c2.102,0.023,3.665,1.507,3.738,5.887c0.241,0.626,2.321,0.832,2.521,0.023c0.275-2.125-0.488-8.304-6.135-8.557c-5.045-0.227-6.796,5.365-6.521,8.587C62.026,76.852,64.134,76.959,64.409,76.235"/>
        <!-- The bird's left eye -->
        <path fill="#482E1F" d="M35.594,76.235c-0.054-4.601-1.747-5.926-3.776-5.901c-2.102,0.023-3.664,1.507-3.738,5.887c-0.241,0.626-2.322,0.832-2.521,0.023c-0.275-2.125,0.488-8.304,6.135-8.557c5.044-0.227,6.797,5.365,6.521,8.587C37.978,76.852,35.87,76.959,35.594,76.235"/>
    </g>
</svg>`

const RABBIT_SVG_EXAMPLE = `<svg viewBox="0 0 100 170">
    <g id="rabbit-legs-and-body">
        <!-- The rabbit's right foot -->
        <path fill="#25A8D3" d="M63.854,134.756c-2.91,0.225-9.595,3.562-11.281,4.375c0.082,7.354,0.045,17.088,0.5,21.832c0.131,1.371,0.396,3.25,2.312,3.709c1.741,0.416,6.129,0.57,7.979-0.355c1.459-0.729,1.875-1.686,1.791-3.02c-0.17-2.725-2.965-4.293-2.896-4.855C62.76,152.4,63.323,143.381,63.854,134.756"/>
        <!-- The rabbit's left foot -->
        <path fill="#25A8D3" d="M35.275,134.756c2.91,0.225,9.595,3.562,11.281,4.375c-0.083,7.354-0.046,17.088-0.5,21.832c-0.132,1.371-0.396,3.25-2.312,3.709c-1.742,0.416-6.38,0.57-8.229-0.355c-1.459-0.729-1.875-1.686-1.792-3.02c0.17-2.725,3.215-4.293,3.146-4.855C36.37,152.4,35.807,143.381,35.275,134.756"/>
        <!-- The rabbit's right arm -->
        <path fill="#25A8D3" d="M60.017,112.48c4.111,6.785,6.549,13.682,8.979,20.301c1.82,4.961,6.773,2.766,6.546-1.273c-0.459-8.139-8.664-25.939-15.178-27.855L60.017,112.48z"/>
        <!-- The rabbit's left arm -->
        <path fill="#25A8D3" d="M38.403,103.654c-6.515,1.914-14.72,19.717-15.179,27.854c-0.228,4.039,4.726,6.234,6.546,1.273c2.43-6.619,4.866-13.516,8.979-20.301L38.403,103.654z"/>
        <!-- The rabbit's torso and belly -->
        <path fill="#25A8D3" d="M61.892,103.838c-1.074,0.08-7.201,0.184-12.323,0.23c-5.122-0.047-11.249-0.15-12.324-0.23c-3.013,11.049-2.333,32.418-1.39,36.4c0.296,1.252,7.127,2.734,11.701,3.545c0.908,0.16,3.345,0.16,4.283,0.012c4.521-0.715,11.086-2.043,11.443-3.557C64.226,136.256,64.905,114.887,61.892,103.838"/>
    </g>
    <g id="rabbit-head-and-face">
        <!-- The rabbit's lower left whiskers -->
        <path fill="#26A7D3" d="M20.487,86.56c0.344-0.081,0.648-0.319,0.796-0.669c0.254-0.586-0.02-1.269-0.606-1.519L8.186,79.01c-0.585-0.249-1.266,0.021-1.518,0.609c-0.251,0.584,0.02,1.267,0.608,1.517l12.488,5.361C20.002,86.598,20.252,86.614,20.487,86.56"/>
        <!-- The rabbit's upper left whiskers -->
        <path fill="#26A7D3" d="M21.669,88.252c0.211-0.284,0.286-0.661,0.175-1.026c-0.187-0.611-0.832-0.951-1.443-0.766L7.403,90.44c-0.605,0.189-0.953,0.834-0.765,1.445c0.186,0.611,0.833,0.954,1.444,0.769l12.996-3.983C21.324,88.596,21.525,88.446,21.669,88.252"/>
        <!-- The rabbit's lower right whiskers -->
        <path fill="#26A7D3" d="M78.827,86.56c-0.344-0.081-0.647-0.319-0.794-0.669c-0.255-0.586,0.017-1.269,0.604-1.519L91.13,79.01c0.583-0.249,1.266,0.021,1.518,0.609c0.25,0.584-0.021,1.267-0.608,1.517L79.55,86.497C79.312,86.598,79.062,86.614,78.827,86.56"/>
        <!-- The rabbit's upper right whiskers -->
        <path fill="#26A7D3" d="M77.646,88.252c-0.211-0.284-0.286-0.661-0.174-1.026c0.186-0.611,0.832-0.951,1.443-0.766l12.995,3.98c0.606,0.189,0.956,0.834,0.767,1.445c-0.188,0.611-0.834,0.954-1.445,0.769l-12.995-3.983C77.991,88.596,77.789,88.446,77.646,88.252"/>
        <!-- The rabbit's head silhouette -->
        <path fill="#26A7D3" d="M79.739,71.262C74.894,52.877,68.053,46.894,62.674,45c-2.997-1.388-7.646-2.284-12.884-2.284c-4.847,0-9.184,0.768-12.18,1.982c-5.497,1.507-12.88,7.026-18.029,26.564c-2.384,9.042-1.847,18.544-0.895,21.257c3.121,8.902,11.795,12.244,15.445,13.186c3.91,1.01,12.814,1.107,15.527,1.107c2.715,0,11.619-0.098,15.527-1.107c3.652-0.941,12.327-4.283,15.447-13.186C81.585,89.804,82.122,80.303,79.739,71.262"/>
        <!-- The rabbit's right ear -->
        <path fill="#26A7D3" d="M82.6,32.313c0,0,4.538-10.056-2.94-13.835l0.006-0.018c-0.029-0.016-0.062-0.018-0.095-0.032c-0.03-0.016-0.053-0.035-0.085-0.05l-0.009,0.016c-7.74-3.208-12.411,6.787-12.411,6.787c-6.544,11.122-6.927,28.251-6.927,28.251l5.348,2.456C65.486,55.888,78.432,44.526,82.6,32.313"/>
        <!-- The rabbit's left ear -->
        <path fill="#26A7D3" d="M17.059,32.445c0,0-4.537-10.056,2.942-13.835l-0.008-0.018c0.03-0.015,0.063-0.018,0.096-0.033c0.029-0.016,0.054-0.035,0.085-0.05l0.009,0.016c7.74-3.208,12.411,6.787,12.411,6.787c6.544,11.121,7.025,28.12,7.025,28.12l-5.348,2.456C34.271,55.888,21.229,44.657,17.059,32.445"/>
        <!-- The rabbit's muzzle and mouth patch -->
        <path fill="#482E1F" d="M73.219,82.087c-3.174,9.859-11.786,16.885-23.572,16.885c-12.239,0-20.965-6.688-23.911-17c-0.464-1.619,0.307-2.074,1.359-2.493c7.141-2.833,14.165-4.193,22.438-4.193s18.586,2.266,22.778,4.533C73.328,80.37,73.564,81.01,73.219,82.087"/>
        <!-- The rabbit's nose -->
        <path fill="#9B148B" d="M55.63,67.193c-0.508-1.629-2.21-2.289-2.942-2.48c-0.786-0.207-2.255-0.24-3.107-0.261c0,0-2.359-0.04-3.154,0.135c-0.739,0.163-2.465,0.755-3.039,2.362c-1.122,3.148,3.242,7.458,4.606,8.05c0.454,0.198,2.254,0.236,2.714,0.057C52.094,74.518,56.626,70.383,55.63,67.193"/>
        <!-- The rabbit's right eye -->
        <path fill="#482E1F" d="M63.131,65.67c0.058-4.851,1.844-6.249,3.982-6.221c2.216,0.023,3.862,1.587,3.941,6.205c0.253,0.661,2.445,0.878,2.656,0.025c0.29-2.241-0.515-8.754-6.468-9.021c-5.317-0.24-7.165,5.656-6.874,9.052C60.618,66.319,62.841,66.432,63.131,65.67"/>
        <!-- The rabbit's left eye -->
        <path fill="#482E1F" d="M35.958,65.67c-0.058-4.851-1.843-6.249-3.982-6.221c-2.216,0.023-3.862,1.587-3.94,6.205c-0.254,0.661-2.447,0.878-2.657,0.025c-0.29-2.241,0.516-8.754,6.468-9.021c5.316-0.24,7.165,5.656,6.873,9.052C38.471,66.319,36.249,66.432,35.958,65.67"/>
    </g>
</svg>`

const DOG_BIRD_RABBIT_GROUP_SVG_EXAMPLE = `<svg viewBox="0 0 1080 400">
    <g id="group-scene-characters">
        <!-- The rabbit on the right: back foot -->
        <path d="M569.868 293.899C563.462 297.857 566.809 318.897 587.956 334.907C607.352 349.575 610.233 333.923 607.33 329.675C607.33 329.675 618.413 334.661 622.469 328.512C626.526 322.363 614.911 307.673 602.409 298.952C589.907 290.232 574.368 291.126 569.868 293.899Z" fill="#00A6B8"/>
        <!-- The rabbit on the right: front foot -->
        <path d="M520.547 282.965C520.547 282.965 499.755 287.683 487.297 287.683L495.676 318.294C511.858 321.29 520.059 304.162 520.059 304.162L520.547 282.965Z" fill="#00A6B8"/>
        <!-- The fox-like middle character: tail -->
        <path d="M583.766 166.448C590.159 165.188 596.401 163.247 602.386 160.657C605.711 158.689 601.633 154.888 597.643 152.831C588.155 147.956 575.099 156.542 575.099 156.542C575.099 156.542 586.626 147.755 590.904 142.433C593.298 139.504 593.52 136.463 587.756 135.725C570.888 133.691 565.59 144.066 560.802 153.613C560.802 153.77 568.782 132.818 568.737 123.919C568.737 120.588 567.563 117.345 562.087 119.917C557.322 122.153 537.505 133.333 545.152 160.5C549.342 175.347 579.444 167.342 583.766 166.448Z" fill="#F05A3C"/>
        <!-- The middle character: body silhouette -->
        <path d="M614.245 191.737C591.081 148.739 539.256 143.507 507.845 178.858C480.381 209.804 481.245 251.616 484.593 260.896C488.427 271.651 495.875 272.568 502.326 267.47C502.326 272.97 509.441 285.179 522.276 273.887C533.736 287.102 566.986 290.679 577.693 280.595C587.49 294.615 596.601 283.323 597.864 277.979C603.051 285.916 611.94 285.179 617.393 276.973C624.287 266.911 633.952 228.206 614.245 191.737Z" fill="#F05A3C"/>
        <!-- The middle character: right eye -->
        <path d="M608.216 206.181C608.881 207.478 606.731 225.522 593.209 223.89C580.707 222.369 582.636 204.504 583.145 203.543C583.655 202.581 587.579 203.073 588.155 203.744C588.731 204.415 586.382 216.958 594.118 218.099C602.275 219.306 602.985 206.159 603.472 205.399C604.254 205.055 605.117 204.946 605.958 205.085C606.8 205.224 607.584 205.604 608.216 206.181Z" fill="#482E1F"/>
        <!-- The middle character: left eye -->
        <path d="M510.483 194.33C509.552 195.448 507.402 213.493 520.924 215.125C533.426 216.646 535.753 198.825 535.465 197.774C535.177 196.723 531.209 196.253 530.544 196.768C529.879 197.282 529.17 210.027 521.411 209.289C513.188 208.507 515.582 195.56 515.271 194.711C514.961 193.861 511.348 193.302 510.483 194.33Z" fill="#482E1F"/>
        <!-- The middle character: yellow muzzle patch -->
        <path d="M574.102 229.346C575.831 218.591 568.538 196.388 561.799 195.292C555.061 194.196 541.206 212.397 539.477 223.353C537.748 234.31 545.241 256.357 551.78 257.43C558.319 258.503 572.328 240.123 574.102 229.346Z" fill="#FAAE17"/>
        <!-- The middle character: nose or mouth shadow -->
        <path d="M566.609 228.071C567.585 221.922 562.752 209.133 559.582 208.618C556.413 208.104 547.834 218.39 546.837 224.65C545.839 230.911 550.937 243.611 553.863 244.081C556.789 244.551 565.634 234.198 566.609 228.071Z" fill="#482E1F"/>
        <!-- The middle character: right leg -->
        <path d="M560.912 400.22C560.212 400.17 559.549 399.878 559.037 399.394C558.524 398.909 558.192 398.261 558.097 397.559C556.987 385.167 556.75 372.711 557.388 360.285C557.399 359.886 557.49 359.494 557.656 359.133C557.822 358.771 558.06 358.447 558.355 358.181C558.65 357.915 558.995 357.713 559.37 357.586C559.745 357.46 560.142 357.412 560.536 357.446C560.929 357.466 561.314 357.564 561.67 357.734C562.025 357.905 562.344 358.144 562.607 358.439C562.871 358.734 563.074 359.079 563.206 359.453C563.337 359.827 563.394 360.224 563.373 360.621C562.813 371.843 562.946 383.089 563.772 394.295C568.205 394.295 572.506 394.295 576.318 394.049C576.711 394.031 577.104 394.091 577.474 394.226C577.844 394.361 578.184 394.569 578.474 394.837C578.764 395.105 579 395.428 579.166 395.788C579.332 396.147 579.427 396.537 579.444 396.933C579.463 397.729 579.176 398.502 578.643 399.09C578.11 399.677 577.372 400.034 576.584 400.086C571.366 400.396 566.135 400.441 560.912 400.22Z" fill="#FAAE17"/>
        <!-- The middle character: left leg -->
        <path d="M536.13 400.22C536.834 400.178 537.501 399.889 538.015 399.403C538.529 398.917 538.858 398.265 538.945 397.559C540.067 385.168 540.304 372.711 539.655 360.285C539.644 359.886 539.553 359.494 539.387 359.133C539.22 358.771 538.982 358.447 538.688 358.181C538.393 357.915 538.048 357.713 537.673 357.586C537.298 357.46 536.901 357.412 536.507 357.446C536.115 357.466 535.73 357.564 535.376 357.734C535.022 357.905 534.704 358.145 534.443 358.441C534.181 358.736 533.98 359.081 533.851 359.455C533.722 359.829 533.668 360.225 533.692 360.621C534.245 371.843 534.104 383.09 533.271 394.295C528.837 394.295 524.537 394.295 520.724 394.049C519.934 394.018 519.164 394.305 518.583 394.845C518.001 395.386 517.656 396.136 517.621 396.933C517.602 397.729 517.889 398.502 518.422 399.09C518.955 399.677 519.693 400.034 520.481 400.086C525.692 400.396 530.915 400.44 536.13 400.22Z" fill="#FAAE17"/>
        <!-- The middle character: torso -->
        <path d="M577.006 270.689H521.367C521.367 270.689 499.6 320.283 508.599 347.473C519.062 379.179 581.395 375.937 589.042 347.473C596.69 319.009 577.006 270.689 577.006 270.689Z" fill="#F05A3C"/>
        <!-- The metallic prop: wheel body -->
        <path d="M475.505 279.119C486.829 279.119 496.009 269.859 496.009 258.436C496.009 247.013 486.829 237.753 475.505 237.753C464.181 237.753 455.001 247.013 455.001 258.436C455.001 269.859 464.181 279.119 475.505 279.119Z" fill="#8C8C99"/>
        <!-- The metallic prop: wheel spokes -->
        <path d="M490.622 250.722L482.509 246.25L485.634 240.392C484.818 239.915 483.966 239.504 483.085 239.162L480.004 244.908L472.445 240.794L474.086 237.731C472.897 237.826 471.718 238.021 470.561 238.312L469.963 239.43L468.832 238.827C467.698 239.211 466.6 239.697 465.551 240.28L468.61 241.957L464.177 250.141L458.325 246.966C457.819 247.765 457.361 248.594 456.951 249.447L462.825 252.645L458.768 260.27L454.934 258.19C454.934 259.328 455.023 260.465 455.2 261.589L457.416 262.796L456.131 265.211C456.521 266.345 457.002 267.444 457.571 268.498L459.899 264.026L467.48 268.14L463.712 275.184C464.485 275.739 465.3 276.232 466.15 276.66L469.963 269.504L478.076 273.976L475.393 278.985C476.523 278.987 477.65 278.89 478.763 278.694L480.558 275.318L483.883 277.129C484.917 276.67 485.911 276.124 486.854 275.497L481.91 272.813L485.989 265.189L492.972 268.968C493.473 268.161 493.91 267.316 494.279 266.441L487.319 262.662L491.752 254.478L495.942 256.714C495.849 255.506 495.649 254.309 495.343 253.137L493.127 251.929L494.235 249.85C493.78 248.807 493.238 247.805 492.617 246.854L490.622 250.722Z" fill="#ADB2BE"/>
        <!-- The metallic prop: support arm -->
        <path d="M463.667 275.362L485.679 322.318C488.073 327.506 491.265 331.262 496.385 329.63C502.082 327.908 502.415 322.497 501.883 317.399C501.705 315.655 494.634 265.971 494.634 265.971L463.667 275.362Z" fill="#3A383F"/>
        <!-- The metallic prop: axle cap -->
        <path d="M495.831 274.423L467.258 283.054L463.689 275.385L494.634 266.016L495.831 274.423Z" fill="#B9BBC2"/>
    </g>
</svg>`

const SVG_GENERATOR_PRESETS: Record<GeminiSvgGeneratorKind, GeminiSvgGeneratorPreset> = {
    character: {
        title: "Character generator",
        subjectInstruction: "Generate only a single character SVG. No background, no floor, no scene props unless they are worn or held by the character.",
        compositionInstruction: "Keep the character centered in frame with a clean silhouette and full body visibility unless the prompt explicitly asks for a portrait crop.",
        promptNotes: [
            "Study the reference SVG code carefully and copy the structural language, not just the palette.",
            "Notice anatomy details explicitly: legs, paws, ears, tails, mouth construction, teeth separators, eye sockets, eyelids, belly shapes, arm placement, and how limbs taper.",
            "Use layered shapes for head, torso, limbs, muzzle, mouth, and tail. Do not collapse the character into a blob.",
            "Keep the same family feel as the references: rounded but well-defined silhouettes, expressive faces, readable paws and feet, and body proportions that feel designed rather than generic.",
            "Mouths should be designed like the references, with a distinct muzzle or mouth mass, inner mouth shape, and teeth or lip separation when appropriate.",
            "Eyes should be expressive and character-specific, using the same kind of dark eye forms, lids, and spacing logic seen in the examples.",
            "Ears and tails must be species-aware and stylized with the same confident shapes as the examples, not thin symbolic add-ons.",
            "When the prompt asks for a species close to dog, cat, bird, or rabbit, lean heavily on the matching reference anatomy and styling.",
        ],
        exampleSvgs: [SMILY_DOG_SVG_EXAMPLE, SMILY_CAT_SVG_EXAMPLE, BIRD_SVG_EXAMPLE, RABBIT_SVG_EXAMPLE, DOG_BIRD_RABBIT_GROUP_SVG_EXAMPLE],
    },
    background: {
        title: "Background generator",
        subjectInstruction: "Generate only a background SVG. No characters. Keep it suitable as a scene backdrop.",
        compositionInstruction: "Focus on environmental shapes, depth layers, and negative space for foreground subjects.",
        exampleSvgs: [],
    },
    object: {
        title: "Object generator",
        subjectInstruction: "Generate only an object SVG. No background and no character body parts unless the object requires them.",
        compositionInstruction: "Keep the object isolated, readable, and centered with enough margin for later compositing.",
        exampleSvgs: [],
    },
}

export const DEFAULT_GEMINI_CONFIG: GeminiConfig = {
    url: Config.GEMINI_BASE_URL,
    apiKey: Config.GEMINI_API_KEY,
    model: Config.GEMINI_MODEL,
    timeout: 30000,
}

function buildGenerateContentUrl(config: GeminiConfig) {
    const baseUrl = config.url.endsWith("/") ? config.url : `${config.url}/`
    return `${baseUrl}models/${config.model}:generateContent?key=${encodeURIComponent(config.apiKey)}`
}

function buildSvgPrompt(prompt: string, generatorKind: GeminiSvgGeneratorKind) {
    const preset = SVG_GENERATOR_PRESETS[generatorKind]
    const referenceSection = buildReferenceSection(preset)

    return [
        preset.title,
        preset.subjectInstruction,
        preset.compositionInstruction,
        ...(preset.promptNotes ?? []),
        "Create a new character for this prompt. Never return an example unchanged or near-unchanged.",
        "Do not copy any reference animal, pose, head shape, or full path layout verbatim.",
        "Transfer the anatomy logic from the references into a fresh design for the requested species.",
        "If the species is not in the references, infer equivalent anatomy: define head mass, torso, forelimbs, hind limbs, feet, eyes, mouth, ears or horns, and tail or equivalent body extension when appropriate.",
        "Avoid blob characters. The result must show readable limb separation and species-specific anatomy.",
        "Return only SVG markup.",
        "Start with <svg and end with </svg>.",
        "Use a 256x256 viewBox unless the prompt clearly needs a different frame.",
        referenceSection,
        "---",
        `${prompt}`,
    ].join("\n")
}

function getGeneratedText(response: ApiResponse<GeminiGenerateContentResponse>) {
    return (
        response.data?.candidates
            ?.flatMap((candidate) => candidate.content?.parts ?? [])
            .map((part) => part.text ?? "")
            .join("\n") ?? ""
    )
}

function extractSvgMarkup(rawText: string): string | null {
    const trimmed = rawText.trim()
    if (!trimmed) return null

    const withoutFences = trimmed.replace(/```svg|```xml|```/gi, "").trim()
    const directMatch = withoutFences.match(/<svg[\s\S]*?<\/svg>/i)
    if (directMatch?.[0]) return directMatch[0].trim()

    const decoded = withoutFences
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
    const decodedMatch = decoded.match(/<svg[\s\S]*?<\/svg>/i)
    if (decodedMatch?.[0]) return decodedMatch[0].trim()

    const firstTagIndex = withoutFences.indexOf("<")
    const lastTagIndex = withoutFences.lastIndexOf(">")
    if (firstTagIndex === -1 || lastTagIndex === -1 || lastTagIndex <= firstTagIndex) return null

    const candidateBody = withoutFences.slice(firstTagIndex, lastTagIndex + 1).trim()
    if (!candidateBody) return null

    // Wrap partial SVG element output when Gemini forgets the root <svg> tag.
    if (/<(g|path|rect|circle|ellipse|polygon|polyline|line|defs|text|image)\b/i.test(candidateBody)) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">${candidateBody}</svg>`
    }

    return null
}

function extractCommentNotes(svgExample: string): string[] {
    return Array.from(svgExample.matchAll(SVG_COMMENT_REGEX), (match) => match[1].trim()).filter(Boolean)
}

function buildReferenceSection(preset: GeminiSvgGeneratorPreset) {
    if (!preset.exampleSvgs.length) return "No character references have been attached for this generator yet."

    const groupedNotes = preset.exampleSvgs
        .map((example, index) => {
            const commentNotes = extractCommentNotes(example)
            if (!commentNotes.length) return null

            return [`Reference anatomy ${index + 1}:`, ...commentNotes.map((note) => `- ${note}`)].join("\n")
        })
        .filter((section): section is string => Boolean(section))

    return [
        "Reference anatomy inventory:",
        "Use these as structural clues only. Do not reproduce the same animal or exact geometry.",
        ...groupedNotes,
    ].join("\n\n")
}

function normalizeSvgMarkup(svgMarkup: string) {
    return svgMarkup.replace(/<!--[^]*?-->/g, "").replace(/\s+/g, " ").trim().toLowerCase()
}

function extractPathData(svgMarkup: string): string[] {
    return Array.from(svgMarkup.matchAll(SVG_PATH_DATA_REGEX), (match) => match[1].trim()).filter(Boolean)
}

function isCopiedExample(svgMarkup: string, preset: GeminiSvgGeneratorPreset) {
    const normalizedOutput = normalizeSvgMarkup(svgMarkup)
    const outputPathData = extractPathData(svgMarkup)

    return preset.exampleSvgs.some((example) => {
        const normalizedExample = normalizeSvgMarkup(example)
        if (normalizedOutput === normalizedExample) return true

        const examplePathData = extractPathData(example)
        if (!outputPathData.length || examplePathData.length < 3) return false

        const matchingPathCount = examplePathData.filter((pathData) => outputPathData.includes(pathData)).length
        const overlapRatio = matchingPathCount / examplePathData.length

        return overlapRatio >= 0.75
    })
}

function buildStrictSvgPrompt(prompt: string, generatorKind: GeminiSvgGeneratorKind) {
    const preset = SVG_GENERATOR_PRESETS[generatorKind]
    const referenceSection = buildReferenceSection(preset)

    return [
        preset.title,
        preset.subjectInstruction,
        preset.compositionInstruction,
        ...(preset.promptNotes ?? []),
        "Generate a brand new character design. Never output any reference example unchanged or nearly unchanged.",
        "Do not reuse the same path data, pose, silhouette, or facial layout from the references.",
        "The result must include a readable head, torso, and clear limb anatomy appropriate to the requested animal.",
        "If the requested animal is unfamiliar, map the reference anatomy system onto that species instead of simplifying into a blob.",
        `${prompt}`,
        "---",
        "Style: Sago Mini x Kurzgesagt x Duolingo.",
        "Return only SVG markup.",
        "Start with <svg and end with </svg>.",
        referenceSection,
    ].join("\n")
}

function getDefaultGenerationConfig() {
    return {
        thinkingConfig: {
            thinkingBudget: 0,
        },
    }
}

export class GeminiService {
    apisauce: ApisauceInstance
    config: GeminiConfig

    constructor(config: GeminiConfig = DEFAULT_GEMINI_CONFIG) {
        this.config = config
        this.apisauce = create({
            baseURL: this.config.url,
            timeout: this.config.timeout,
            headers: {
                Accept: "application/json",
            },
        })
    }

    async generateSvg(prompt: string, generatorKind: GeminiSvgGeneratorKind = "character"): Promise<GeminiSvgResult> {
        // Generate one SVG from one prompt.
        const promptTrimmed = prompt.trim()
        if (!promptTrimmed) return { kind: "empty-prompt" }
        if (!this.config.apiKey) return { kind: "missing-api-key" }
        const preset = SVG_GENERATOR_PRESETS[generatorKind]

        const requestUrl = buildGenerateContentUrl(this.config)

        let response: ApiResponse<GeminiGenerateContentResponse>

        try {
            response = await this.apisauce.post(requestUrl, {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: buildSvgPrompt(promptTrimmed, generatorKind) }],
                    },
                ],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 8192,
                    ...getDefaultGenerationConfig(),
                },
            })
        } catch {
            return { kind: "unknown", temporary: true }
        }

        if (!response.ok) {
            const problem = getGeminiProblem(response)
            if (problem) return problem
        }

        let svgMarkup = extractSvgMarkup(getGeneratedText(response))

        if (svgMarkup && isCopiedExample(svgMarkup, preset)) {
            svgMarkup = null
        }

        if (!svgMarkup) {
            try {
                const retryResponse: ApiResponse<GeminiGenerateContentResponse> = await this.apisauce.post(requestUrl, {
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: buildStrictSvgPrompt(promptTrimmed, generatorKind) }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 8192,
                        ...getDefaultGenerationConfig(),
                    },
                })

                if (retryResponse.ok) {
                    const retriedSvgMarkup = extractSvgMarkup(getGeneratedText(retryResponse))
                    if (retriedSvgMarkup && !isCopiedExample(retriedSvgMarkup, preset)) {
                        svgMarkup = retriedSvgMarkup
                    }
                }
            } catch {
                // Keep the original invalid-svg flow when retry fails.
            }
        }

        if (!svgMarkup) return { kind: "invalid-svg" }

        return { kind: "ok", svgMarkup }
    }
}

export const geminiService = new GeminiService()
