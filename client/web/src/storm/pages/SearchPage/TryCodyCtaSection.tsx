import React from 'react'

import { mdiArrowRight, mdiClose } from '@mdi/js'
import classNames from 'classnames'

import { useTemporarySetting } from '@sourcegraph/shared/src/settings/temporary'
import { TelemetryV2Props } from '@sourcegraph/shared/src/telemetry'
import type { TelemetryProps } from '@sourcegraph/shared/src/telemetry/telemetryService'
import { Button, ButtonLink, H2, H3, Icon, Link, Text } from '@sourcegraph/wildcard'

import { isCodyEnabled } from '../../../cody/isCodyEnabled'
import { MarketingBlock } from '../../../components/MarketingBlock'
import { EventName } from '../../../util/constants'

import styles from './TryCodyCtaSection.module.scss'

const MeetCodySVG: React.FC = () => (
    <svg width="277" height="112" viewBox="0 0 277 112" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.97">
            <path
                d="M90.8896 27.6508C90.8896 19.5585 97.4497 12.9984 105.542 12.9984H238.347C246.44 12.9984 253 19.5585 253 27.6508V36.7388C253 44.8311 246.44 51.3912 238.347 51.3912H90.8896V27.6508Z"
                fill="#5E6E8C"
            />
        </g>
        <path
            d="M90 22.6524C90 14.5601 96.5601 8 104.652 8H237.458C245.55 8 252.11 14.5601 252.11 22.6524V31.7404C252.11 39.8327 245.55 46.3928 237.458 46.3928H90V22.6524Z"
            fill="white"
        />
        <path
            d="M114.763 33.4797V24.2957H115.925V33.4797H114.763ZM123.82 33.6477C123.372 33.6477 122.952 33.5684 122.56 33.4097C122.168 33.2511 121.827 33.0224 121.538 32.7237C121.258 32.4157 121.034 32.0424 120.866 31.6037C120.707 31.1557 120.628 30.6517 120.628 30.0917C120.628 29.5224 120.717 29.0184 120.894 28.5797C121.071 28.1317 121.309 27.7537 121.608 27.4457C121.907 27.1377 122.252 26.9044 122.644 26.7457C123.045 26.5871 123.465 26.5077 123.904 26.5077C124.352 26.5077 124.735 26.5871 125.052 26.7457C125.369 26.9044 125.649 27.0911 125.892 27.3057L125.304 28.0617C125.108 27.8844 124.898 27.7397 124.674 27.6277C124.459 27.5157 124.217 27.4597 123.946 27.4597C123.638 27.4597 123.353 27.5251 123.092 27.6557C122.831 27.7771 122.607 27.9544 122.42 28.1877C122.233 28.4211 122.084 28.7011 121.972 29.0277C121.869 29.3451 121.818 29.6997 121.818 30.0917C121.818 30.4837 121.869 30.8384 121.972 31.1557C122.075 31.4731 122.215 31.7484 122.392 31.9817C122.579 32.2057 122.803 32.3831 123.064 32.5137C123.325 32.6351 123.61 32.6957 123.918 32.6957C124.235 32.6957 124.525 32.6304 124.786 32.4997C125.057 32.3597 125.299 32.1964 125.514 32.0097L126.018 32.7797C125.71 33.0504 125.369 33.2651 124.996 33.4237C124.623 33.5731 124.231 33.6477 123.82 33.6477ZM128.948 33.6477C128.379 33.6477 127.903 33.4797 127.52 33.1437C127.147 32.8077 126.96 32.3317 126.96 31.7157C126.96 30.9691 127.291 30.3997 127.954 30.0077C128.617 29.6064 129.676 29.3264 131.132 29.1677C131.132 28.9531 131.109 28.7431 131.062 28.5377C131.025 28.3324 130.955 28.1504 130.852 27.9917C130.749 27.8331 130.605 27.7071 130.418 27.6137C130.241 27.5111 130.012 27.4597 129.732 27.4597C129.34 27.4597 128.971 27.5344 128.626 27.6837C128.281 27.8331 127.973 28.0011 127.702 28.1877L127.254 27.3897C127.571 27.1844 127.959 26.9884 128.416 26.8017C128.873 26.6057 129.377 26.5077 129.928 26.5077C130.759 26.5077 131.361 26.7644 131.734 27.2777C132.107 27.7817 132.294 28.4584 132.294 29.3077V33.4797H131.342L131.244 32.6677H131.202C130.875 32.9384 130.525 33.1717 130.152 33.3677C129.779 33.5544 129.377 33.6477 128.948 33.6477ZM129.284 32.7237C129.611 32.7237 129.919 32.6491 130.208 32.4997C130.497 32.3411 130.805 32.1124 131.132 31.8137V29.9237C130.563 29.9984 130.082 30.0871 129.69 30.1897C129.307 30.2924 128.995 30.4137 128.752 30.5537C128.519 30.6937 128.346 30.8571 128.234 31.0437C128.131 31.2211 128.08 31.4171 128.08 31.6317C128.08 32.0237 128.197 32.3037 128.43 32.4717C128.663 32.6397 128.948 32.7237 129.284 32.7237ZM134.435 33.4797V26.6757H135.387L135.485 27.6557H135.527C135.853 27.3291 136.194 27.0584 136.549 26.8437C136.913 26.6197 137.333 26.5077 137.809 26.5077C138.527 26.5077 139.05 26.7317 139.377 27.1797C139.713 27.6277 139.881 28.2904 139.881 29.1677V33.4797H138.733V29.3217C138.733 28.6777 138.63 28.2157 138.425 27.9357C138.219 27.6464 137.893 27.5017 137.445 27.5017C137.09 27.5017 136.777 27.5904 136.507 27.7677C136.236 27.9451 135.928 28.2064 135.583 28.5517V33.4797H134.435ZM144.894 33.4797V23.5117H146.042V26.2277L146 27.6277C146.326 27.3197 146.667 27.0584 147.022 26.8437C147.376 26.6197 147.792 26.5077 148.268 26.5077C148.986 26.5077 149.509 26.7317 149.836 27.1797C150.172 27.6277 150.34 28.2904 150.34 29.1677V33.4797H149.192V29.3217C149.192 28.6777 149.089 28.2157 148.884 27.9357C148.678 27.6464 148.352 27.5017 147.904 27.5017C147.549 27.5017 147.236 27.5904 146.966 27.7677C146.695 27.9451 146.387 28.2064 146.042 28.5517V33.4797H144.894ZM155.267 33.6477C154.809 33.6477 154.38 33.5684 153.979 33.4097C153.587 33.2417 153.241 33.0084 152.943 32.7097C152.653 32.4017 152.425 32.0284 152.257 31.5897C152.089 31.1511 152.005 30.6517 152.005 30.0917C152.005 29.5317 152.089 29.0324 152.257 28.5937C152.434 28.1457 152.663 27.7677 152.943 27.4597C153.232 27.1517 153.559 26.9184 153.923 26.7597C154.287 26.5917 154.665 26.5077 155.057 26.5077C155.486 26.5077 155.869 26.5824 156.205 26.7317C156.55 26.8811 156.835 27.0957 157.059 27.3757C157.292 27.6557 157.469 27.9917 157.591 28.3837C157.712 28.7757 157.773 29.2144 157.773 29.6997C157.773 29.8211 157.768 29.9424 157.759 30.0637C157.759 30.1757 157.749 30.2737 157.731 30.3577H153.139C153.185 31.0857 153.409 31.6644 153.811 32.0937C154.221 32.5137 154.753 32.7237 155.407 32.7237C155.733 32.7237 156.032 32.6771 156.303 32.5837C156.583 32.4811 156.849 32.3504 157.101 32.1917L157.507 32.9477C157.208 33.1344 156.877 33.2977 156.513 33.4377C156.149 33.5777 155.733 33.6477 155.267 33.6477ZM153.125 29.5317H156.765C156.765 28.8411 156.615 28.3184 156.317 27.9637C156.027 27.5997 155.617 27.4177 155.085 27.4177C154.842 27.4177 154.609 27.4644 154.385 27.5577C154.17 27.6511 153.974 27.7911 153.797 27.9777C153.619 28.1551 153.47 28.3744 153.349 28.6357C153.237 28.8971 153.162 29.1957 153.125 29.5317ZM160.672 33.6477C160.233 33.6477 159.921 33.5171 159.734 33.2557C159.547 32.9944 159.454 32.6117 159.454 32.1077V23.5117H160.602V32.1917C160.602 32.3784 160.635 32.5091 160.7 32.5837C160.765 32.6584 160.84 32.6957 160.924 32.6957C160.961 32.6957 160.994 32.6957 161.022 32.6957C161.059 32.6957 161.111 32.6864 161.176 32.6677L161.33 33.5357C161.255 33.5731 161.167 33.6011 161.064 33.6197C160.961 33.6384 160.831 33.6477 160.672 33.6477ZM163.022 36.3497V26.6757H163.974L164.072 27.4597H164.114C164.422 27.1984 164.758 26.9744 165.122 26.7877C165.496 26.6011 165.883 26.5077 166.284 26.5077C166.723 26.5077 167.11 26.5917 167.446 26.7597C167.782 26.9184 168.062 27.1517 168.286 27.4597C168.51 27.7584 168.678 28.1224 168.79 28.5517C168.912 28.9717 168.972 29.4477 168.972 29.9797C168.972 30.5584 168.893 31.0764 168.734 31.5337C168.576 31.9817 168.361 32.3644 168.09 32.6817C167.82 32.9991 167.507 33.2417 167.152 33.4097C166.798 33.5684 166.424 33.6477 166.032 33.6477C165.715 33.6477 165.398 33.5777 165.08 33.4377C164.772 33.2977 164.46 33.1064 164.142 32.8637L164.17 34.0537V36.3497H163.022ZM165.836 32.6817C166.116 32.6817 166.373 32.6211 166.606 32.4997C166.849 32.3691 167.054 32.1917 167.222 31.9677C167.4 31.7344 167.535 31.4497 167.628 31.1137C167.731 30.7777 167.782 30.3997 167.782 29.9797C167.782 29.6064 167.75 29.2657 167.684 28.9577C167.619 28.6497 167.512 28.3884 167.362 28.1737C167.222 27.9497 167.036 27.7771 166.802 27.6557C166.578 27.5344 166.308 27.4737 165.99 27.4737C165.701 27.4737 165.407 27.5531 165.108 27.7117C164.819 27.8704 164.506 28.0991 164.17 28.3977V31.9677C164.478 32.2291 164.777 32.4157 165.066 32.5277C165.356 32.6304 165.612 32.6817 165.836 32.6817ZM174.669 33.4797L172.779 26.6757H173.955L174.963 30.6097C175.037 30.9364 175.107 31.2537 175.173 31.5617C175.238 31.8697 175.303 32.1824 175.369 32.4997H175.425C175.499 32.1824 175.574 31.8697 175.649 31.5617C175.723 31.2444 175.803 30.9271 175.887 30.6097L176.937 26.6757H178.057L179.121 30.6097C179.205 30.9364 179.284 31.2537 179.359 31.5617C179.443 31.8697 179.522 32.1824 179.597 32.4997H179.653C179.727 32.1824 179.797 31.8697 179.863 31.5617C179.928 31.2537 179.998 30.9364 180.073 30.6097L181.067 26.6757H182.159L180.339 33.4797H178.939L177.959 29.8257C177.875 29.4991 177.795 29.1771 177.721 28.8597C177.655 28.5424 177.581 28.2111 177.497 27.8657H177.441C177.366 28.2111 177.291 28.5471 177.217 28.8737C177.142 29.1911 177.058 29.5131 176.965 29.8397L176.013 33.4797H174.669ZM183.64 33.4797V26.6757H184.788V33.4797H183.64ZM184.228 25.2757C184.004 25.2757 183.812 25.2057 183.654 25.0657C183.504 24.9257 183.43 24.7484 183.43 24.5337C183.43 24.3097 183.504 24.1324 183.654 24.0017C183.812 23.8617 184.004 23.7917 184.228 23.7917C184.452 23.7917 184.638 23.8617 184.788 24.0017C184.946 24.1324 185.026 24.3097 185.026 24.5337C185.026 24.7484 184.946 24.9257 184.788 25.0657C184.638 25.2057 184.452 25.2757 184.228 25.2757ZM189.227 33.6477C188.863 33.6477 188.555 33.5917 188.303 33.4797C188.06 33.3677 187.86 33.2137 187.701 33.0177C187.552 32.8217 187.444 32.5837 187.379 32.3037C187.314 32.0237 187.281 31.7157 187.281 31.3797V27.6137H186.273V26.7457L187.337 26.6757L187.477 24.7717H188.443V26.6757H190.277V27.6137H188.443V31.3937C188.443 31.8137 188.518 32.1404 188.667 32.3737C188.826 32.5977 189.101 32.7097 189.493 32.7097C189.614 32.7097 189.745 32.6911 189.885 32.6537C190.025 32.6164 190.151 32.5744 190.263 32.5277L190.487 33.3957C190.3 33.4611 190.095 33.5171 189.871 33.5637C189.656 33.6197 189.442 33.6477 189.227 33.6477ZM191.815 33.4797V23.5117H192.963V26.2277L192.921 27.6277C193.248 27.3197 193.589 27.0584 193.943 26.8437C194.298 26.6197 194.713 26.5077 195.189 26.5077C195.908 26.5077 196.431 26.7317 196.757 27.1797C197.093 27.6277 197.261 28.2904 197.261 29.1677V33.4797H196.113V29.3217C196.113 28.6777 196.011 28.2157 195.805 27.9357C195.6 27.6464 195.273 27.5017 194.825 27.5017C194.471 27.5017 194.158 27.5904 193.887 27.7677C193.617 27.9451 193.309 28.2064 192.963 28.5517V33.4797H191.815ZM204.375 33.6477C204.011 33.6477 203.703 33.5917 203.451 33.4797C203.209 33.3677 203.008 33.2137 202.849 33.0177C202.7 32.8217 202.593 32.5837 202.527 32.3037C202.462 32.0237 202.429 31.7157 202.429 31.3797V27.6137H201.421V26.7457L202.485 26.6757L202.625 24.7717H203.591V26.6757H205.425V27.6137H203.591V31.3937C203.591 31.8137 203.666 32.1404 203.815 32.3737C203.974 32.5977 204.249 32.7097 204.641 32.7097C204.763 32.7097 204.893 32.6911 205.033 32.6537C205.173 32.6164 205.299 32.5744 205.411 32.5277L205.635 33.3957C205.449 33.4611 205.243 33.5171 205.019 33.5637C204.805 33.6197 204.59 33.6477 204.375 33.6477ZM206.964 33.4797V23.5117H208.112V26.2277L208.07 27.6277C208.397 27.3197 208.737 27.0584 209.092 26.8437C209.447 26.6197 209.862 26.5077 210.338 26.5077C211.057 26.5077 211.579 26.7317 211.906 27.1797C212.242 27.6277 212.41 28.2904 212.41 29.1677V33.4797H211.262V29.3217C211.262 28.6777 211.159 28.2157 210.954 27.9357C210.749 27.6464 210.422 27.5017 209.974 27.5017C209.619 27.5017 209.307 27.5904 209.036 27.7677C208.765 27.9451 208.457 28.2064 208.112 28.5517V33.4797H206.964ZM216.147 33.6477C215.578 33.6477 215.102 33.4797 214.719 33.1437C214.346 32.8077 214.159 32.3317 214.159 31.7157C214.159 30.9691 214.49 30.3997 215.153 30.0077C215.816 29.6064 216.875 29.3264 218.331 29.1677C218.331 28.9531 218.308 28.7431 218.261 28.5377C218.224 28.3324 218.154 28.1504 218.051 27.9917C217.948 27.8331 217.804 27.7071 217.617 27.6137C217.44 27.5111 217.211 27.4597 216.931 27.4597C216.539 27.4597 216.17 27.5344 215.825 27.6837C215.48 27.8331 215.172 28.0011 214.901 28.1877L214.453 27.3897C214.77 27.1844 215.158 26.9884 215.615 26.8017C216.072 26.6057 216.576 26.5077 217.127 26.5077C217.958 26.5077 218.56 26.7644 218.933 27.2777C219.306 27.7817 219.493 28.4584 219.493 29.3077V33.4797H218.541L218.443 32.6677H218.401C218.074 32.9384 217.724 33.1717 217.351 33.3677C216.978 33.5544 216.576 33.6477 216.147 33.6477ZM216.483 32.7237C216.81 32.7237 217.118 32.6491 217.407 32.4997C217.696 32.3411 218.004 32.1124 218.331 31.8137V29.9237C217.762 29.9984 217.281 30.0871 216.889 30.1897C216.506 30.2924 216.194 30.4137 215.951 30.5537C215.718 30.6937 215.545 30.8571 215.433 31.0437C215.33 31.2211 215.279 31.4171 215.279 31.6317C215.279 32.0237 215.396 32.3037 215.629 32.4717C215.862 32.6397 216.147 32.7237 216.483 32.7237ZM223.584 33.6477C223.22 33.6477 222.912 33.5917 222.66 33.4797C222.418 33.3677 222.217 33.2137 222.058 33.0177C221.909 32.8217 221.802 32.5837 221.736 32.3037C221.671 32.0237 221.638 31.7157 221.638 31.3797V27.6137H220.63V26.7457L221.694 26.6757L221.834 24.7717H222.8V26.6757H224.634V27.6137H222.8V31.3937C222.8 31.8137 222.875 32.1404 223.024 32.3737C223.183 32.5977 223.458 32.7097 223.85 32.7097C223.972 32.7097 224.102 32.6911 224.242 32.6537C224.382 32.6164 224.508 32.5744 224.62 32.5277L224.844 33.3957C224.658 33.4611 224.452 33.5171 224.228 33.5637C224.014 33.6197 223.799 33.6477 223.584 33.6477ZM226.871 33.6477C226.637 33.6477 226.437 33.5684 226.269 33.4097C226.11 33.2417 226.031 33.0317 226.031 32.7797C226.031 32.5091 226.11 32.2944 226.269 32.1357C226.437 31.9677 226.637 31.8837 226.871 31.8837C227.095 31.8837 227.286 31.9677 227.445 32.1357C227.613 32.2944 227.697 32.5091 227.697 32.7797C227.697 33.0317 227.613 33.2417 227.445 33.4097C227.286 33.5684 227.095 33.6477 226.871 33.6477Z"
            fill="#0F111A"
        />
        <path
            d="M90 22.6524C90 14.5601 96.5601 8 104.652 8H237.458C245.55 8 252.11 14.5601 252.11 22.6524V31.7404C252.11 39.8327 245.55 46.3928 237.458 46.3928H90V22.6524Z"
            stroke="url(#paint0_linear_381_25288)"
            strokeWidth="3.26861"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M64.8392 55.1775C67.6336 55.1775 69.8989 57.4024 69.8989 60.1469L69.8989 71.5055C69.8989 74.25 67.6336 76.4749 64.8392 76.4749C62.0448 76.4749 59.7795 74.25 59.7795 71.5055L59.7795 60.1469C59.7795 57.4024 62.0448 55.1775 64.8392 55.1775Z"
            fill="#FF5543"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.2524 67.9559C27.2524 65.2114 29.5178 62.9865 32.3122 62.9865H43.8773C46.6717 62.9865 48.937 65.2114 48.937 67.9559C48.937 70.7004 46.6717 72.9253 43.8773 72.9253H32.3122C29.5178 72.9253 27.2524 70.7004 27.2524 67.9559Z"
            fill="#A112FF"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M33.0864 85.8895C31.4044 83.7175 28.25 83.283 26.0237 84.9229C23.7882 86.5696 23.3351 89.6844 25.0118 91.88L29.0595 88.8984C25.0118 91.88 25.0132 91.8819 25.0146 91.8838L25.0177 91.8877L25.0243 91.8964L25.0399 91.9165C25.0512 91.9312 25.0645 91.9482 25.0798 91.9676C25.1103 92.0064 25.1488 92.0546 25.1951 92.1115C25.2877 92.2254 25.4121 92.3746 25.5681 92.5539C25.8799 92.9122 26.3201 93.393 26.8885 93.9547C28.0226 95.0752 29.6851 96.535 31.8766 97.9872C36.2755 100.902 42.8456 103.807 51.4669 103.807C60.0882 103.807 66.6583 100.902 71.0572 97.9872C73.2487 96.535 74.9112 95.0752 76.0453 93.9547C76.6138 93.393 77.0539 92.9122 77.3657 92.5539C77.5218 92.3746 77.6461 92.2254 77.7387 92.1115C77.7851 92.0546 77.8235 92.0064 77.854 91.9676C77.8693 91.9482 77.8826 91.9312 77.894 91.9165L77.9095 91.8964L77.9162 91.8877L77.9192 91.8838C77.9207 91.8819 77.9221 91.88 73.8743 88.8984L77.9221 91.88C79.5987 89.6844 79.1457 86.5696 76.9101 84.9229C74.6839 83.283 71.5295 83.7175 69.8475 85.8895C69.8446 85.8931 69.8395 85.8994 69.8322 85.9084C69.8064 85.9402 69.7532 86.0045 69.6728 86.0969C69.5116 86.2821 69.2431 86.5778 68.8685 86.9479C68.1165 87.6909 66.9555 88.7158 65.3974 89.7483C62.297 91.8028 57.6634 93.8678 51.4669 93.8678C45.2704 93.8678 40.6369 91.8028 37.5365 89.7483C35.9784 88.7158 34.8174 87.6909 34.0654 86.9479C33.6908 86.5778 33.4222 86.2821 33.2611 86.0969C33.1806 86.0045 33.1275 85.9402 33.1017 85.9084C33.0944 85.8995 33.0893 85.8931 33.0864 85.8895ZM69.8324 85.909L69.8317 85.9099L69.8292 85.9132C69.8279 85.9149 69.8266 85.9167 73.7438 88.8023L69.8265 85.9167C69.8285 85.9142 69.8305 85.9116 69.8324 85.909Z"
            fill="#00CBEC"
        />
        <defs>
            <linearGradient
                id="paint0_linear_381_25288"
                x1="82.8079"
                y1="8"
                x2="244.452"
                y2="67.2761"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#00CBEC" />
                <stop offset="1" stopColor="#A112FF" />
            </linearGradient>
        </defs>
    </svg>
)

interface TryCodyCtaSectionProps extends TelemetryProps, TelemetryV2Props {
    isSourcegraphDotCom: boolean
    className?: string
}

export const TryCodyCtaSection: React.FC<TryCodyCtaSectionProps> = ({
    className,
    telemetryService,
    telemetryRecorder,
    isSourcegraphDotCom,
}) => {
    const [isDismissed = true, setIsDismissed] = useTemporarySetting('cody.searchPageCta.dismissed', false)
    const onDismiss = (): void => setIsDismissed(true)
    const recordEvent = (eventName: EventName): void => {
        telemetryService.log(eventName, { type: 'ComHome' }, { type: 'ComHome' })
        telemetryRecorder.recordEvent(eventName, 'recorded', { privateMetadata: { type: 'ComHome' } })
    }
    const onViewEditorExtensionsClick = (): void => recordEvent(EventName.VIEW_EDITOR_EXTENSIONS)
    const onTryWebClick = (): void => recordEvent(EventName.TRY_CODY_WEB)

    if (isDismissed) {
        return null
    }

    if (!isCodyEnabled()) {
        return (
            <div
                className={classNames(styles.notEnabledBlock, 'd-flex justify-content-center align-items-center mt-5')}
            >
                <div className={classNames(styles.codyIllustration)}>
                    <MeetCodySVG />
                </div>
                <Text>
                    <Link to="https://about.sourcegraph.com/cody?utm_source=server">Learn about Cody</Link>,
                    Sourcegraph's AI coding assistant
                </Text>
                <Button className={classNames(styles.closeButton, 'position-absolute m-0')} onClick={onDismiss}>
                    <Icon svgPath={mdiClose} aria-label="Close try Cody widget" />
                </Button>
            </div>
        )
    }

    return (
        <div className={classNames('d-flex position-relative pt-4', className, styles.container)}>
            <div className={classNames(styles.codyIllustration)}>
                <MeetCodySVG />
                <H2>Meet Cody, your AI assistant</H2>
            </div>
            <MarketingBlock
                wrapperClassName="d-flex"
                contentClassName={classNames('flex-grow-1 d-flex flex-column justify-content-between p-4', styles.card)}
            >
                <H3 className="d-flex align-items-center">
                    <CodyInIDEIcon aria-hidden={true} />
                    Get Cody in your editor
                </H3>
                <Text>Cody helps you write, fix, and understand code in your editor.</Text>
                <div className="mb-2">
                    <ButtonLink
                        to="/help/cody#get-cody"
                        variant="primary"
                        className="d-inline-flex align-items-center"
                        onClick={onViewEditorExtensionsClick}
                    >
                        View editor extensions <Icon svgPath={mdiArrowRight} aria-hidden={true} size="md" />
                    </ButtonLink>
                </div>
            </MarketingBlock>
            {isSourcegraphDotCom ? (
                <>
                    <div className="d-flex flex-column justify-content-center p-4">
                        <H3>Cody for Sourcegraph.com</H3>
                        <Text>
                            A free, helpful AI assistant, that explains, generates, and transpiles code, in the
                            Sourcegraph web interface.
                        </Text>
                        <Text
                            as={Link}
                            to="/cody/chat"
                            className={classNames('d-flex align-items-center mb-2', styles.tryCodyLink)}
                            onClick={onTryWebClick}
                        >
                            Try Cody chat
                            <Icon svgPath={mdiArrowRight} aria-hidden={true} size="sm" className="ml-1" />
                        </Text>
                        <Text
                            as={Link}
                            to="https://sourcegraph.com/github.com/openai/openai-cookbook/-/blob/apps/file-q-and-a/nextjs-with-flask-server/server/answer_question.py"
                            className={classNames('d-flex align-items-center', styles.tryCodyLink)}
                            onClick={onTryWebClick}
                        >
                            Try Cody on a file
                            <Icon svgPath={mdiArrowRight} aria-hidden={true} size="sm" className="ml-1" />
                        </Text>
                    </div>
                    <Button className={classNames(styles.closeButton, 'position-absolute m-0')} onClick={onDismiss}>
                        <Icon svgPath={mdiClose} aria-label="Close try Cody widget" />
                    </Button>
                </>
            ) : (
                <>
                    <div className="d-flex flex-column justify-content-center p-4">
                        <H3>Try Cody in the web application</H3>
                        <Text>
                            Cody for Sourcegraph explains, generates, and translates code, right in the web interface.
                        </Text>
                        <Text
                            as={Link}
                            to="/cody/chat"
                            className={classNames('d-flex align-items-center mb-2', styles.tryCodyLink)}
                            onClick={onTryWebClick}
                        >
                            Cody Chat
                            <Icon svgPath={mdiArrowRight} aria-hidden={true} size="sm" className="ml-1" />
                        </Text>
                    </div>
                    <Button className={classNames(styles.closeButton, 'position-absolute m-0')} onClick={onDismiss}>
                        <Icon svgPath={mdiClose} aria-label="Close try Cody widget" />
                    </Button>
                </>
            )}
        </div>
    )
}

const CodyInIDEIcon: React.FunctionComponent<{ className?: string }> = ({ className }) => (
    <svg
        width="34"
        height="23"
        viewBox="10 0 48 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M17.5623 26.079C17.5623 26.4422 17.7005 26.7906 17.9467 27.0474C18.1928 27.3042 18.5267 27.4485 18.8748 27.4485H21.4998V30.1877H18.2185C17.4966 30.1877 16.2498 29.5714 16.2498 28.8181C16.2498 29.5714 15.0029 30.1877 14.281 30.1877H10.9998V27.4485H13.6248C13.9729 27.4485 14.3067 27.3042 14.5528 27.0474C14.799 26.7906 14.9373 26.4422 14.9373 26.079V6.90505C14.9373 6.54182 14.799 6.19347 14.5528 5.93662C14.3067 5.67978 13.9729 5.53549 13.6248 5.53549H10.9998V2.79636H14.281C15.0029 2.79636 16.2498 3.41266 16.2498 4.16592C16.2498 3.41266 17.4966 2.79636 18.2185 2.79636H21.4998V5.53549H18.8748C18.5267 5.53549 18.1928 5.67978 17.9467 5.93662C17.7005 6.19347 17.5623 6.54182 17.5623 6.90505V26.079Z"
            fill="#A305E1"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M39.5458 7.992C40.6755 7.992 41.5912 8.86333 41.5912 9.93817V13.398C41.5912 14.4729 40.6755 15.3442 39.5458 15.3442C38.4161 15.3442 37.5003 14.4729 37.5003 13.398V9.93817C37.5003 8.86333 38.4161 7.992 39.5458 7.992Z"
            fill="#A305E1"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M26.5908 12.533C26.5908 11.4581 27.5066 10.5868 28.6362 10.5868H32.2726C33.4023 10.5868 34.3181 11.4581 34.3181 12.533C34.3181 13.6078 33.4023 14.4791 32.2726 14.4791H28.6362C27.5066 14.4791 26.5908 13.6078 26.5908 12.533Z"
            fill="#A305E1"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M44.4341 18.1987C45.1621 18.8567 45.1916 19.9517 44.5 20.6444L43.8564 21.2889C38.8205 26.3326 30.3304 26.207 25.4617 21.0167C24.7931 20.3039 24.8584 19.2103 25.6075 18.5741C26.3567 17.938 27.5061 18.0001 28.1747 18.7129C31.6275 22.3938 37.6486 22.4829 41.2201 18.906L41.8636 18.2614C42.5552 17.5687 43.7061 17.5407 44.4341 18.1987Z"
            fill="#A305E1"
        />
    </svg>
)
