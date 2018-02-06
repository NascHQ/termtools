#!/bin/bash

function battery_charge() {
    local battery_path="/sys/class/power_supply/BAT0"
    local battery_path2="/sys/class/power_supply/BAT1/"

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
                        BATT_PCT=$(( 100 * curcap / maxcap))
                    fi
                done < <(ioreg -n AppleSmartBattery -r | grep -o '"[^"]*" = [^ ]*' | sed -e 's/= //g' -e 's/"//g' | sort)
            fi
            ;;
        "Linux")
            case $(cat /etc/*-release) in
                *"Arch Linux"*|*"Ubuntu"*|*"openSUSE"*)
                    battery_state=$(cat $battery_path2/capacity || cat $battery_path/energy_now)
                    battery_full=$battery_path/energy_full
                    battery_current=$battery_path/energy_now
                    ;;
                *)
                    battery_state=$(cat $battery_path2/status || cat $battery_path/status)
                    battery_full=$battery_path/charge_full
                    battery_current=$battery_path/charge_now
                    ;;
            esac
            if [ $battery_state == 'Discharging' ]; then
                BATT_CONNECTED=0
            else
                BATT_CONNECTED=1
            fi
                BATTERY_STATE=$(cat $battery_current)
                # full=$(cat $battery_full)
                BATT_PCT=$((100 * $now / $full))
            ;;
    esac
}

battery_charge
