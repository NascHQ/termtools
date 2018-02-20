#!/bin/bash

function battery_charge() {
    local battery_path="/sys/class/power_supply/BAT1/"
    local curcap
    local maxcap
    BATT_PCT=99
    case $(uname -s) in
        "Darwin")
            if ((pmset_on)) && command -v pmset &>/dev/null; then
                if [ "$(pmset -g batt | grep -o 'AC Power')" ]; then
                    BATT_CONNECTED=1
                else
                    BATT_CONNECTED=0
                fi
                BATT_PCT=$(pmset -g batt | grep -o '[0-9]*%' | tr -d %)
            else
                while read key value; do
                    case $key in
                        "MaxCapacity")
                            maxcap=$value
                            ;;
                        "CurrentCapacity")
                            curcap=$value
                            ;;
                        "ExternalConnected")
                            if [ $value == "No" ]; then
                                BATT_CONNECTED=0
                            else
                                BATT_CONNECTED=1
                            fi
                            ;;
                    esac
                    if [[ -n "$maxcap" && -n $curcap ]]; then
                        BATT_PCT=$[100 * $curcap / $maxcap]
                    fi
                done < <(ioreg -n AppleSmartBattery -r | grep -o '"[^"]*" = [^ ]*' | sed -e 's/= //g' -e 's/"//g' | sort)
            fi
            ;;
        "Linux")
            case $(cat /etc/*-release) in
                *"Arch Linux"*|*"Ubuntu"*|*"openSUSE"*)
                    BATT_PCT=$(cat $battery_path/capacity 2>/dev/null || echo "100")
                    battery_state=$(cat $battery_path/status 2>/dev/null || echo "Charging")
                    ;;
                *)
                    BATT_PCT=$(cat $battery_path/capacity 2>/dev/null || echo "100")
                    battery_state=$(cat $battery_path/status 2>/dev/null || echo "Charging")
                    ;;
            esac
            if [ $battery_state == 'Discharging' ]; then
                BATT_CONNECTED=0
            else
                BATT_CONNECTED=1
            fi
                BATTERY_STATE=$battery_state
            ;;
    esac
}

battery_charge
