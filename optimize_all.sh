#!/bin/bash
MODELS=(
  "src/assets/3d/robotic_arm_opt.glb"
  "src/assets/3d/fpv_racing_drone_opt.glb"
  "src/assets/3d/line_follower_robot_opt.glb"
  "src/assets/3d/rocket_opt.glb"
  "src/assets/3d/RobotLIDAR_opt.glb"
  "src/assets/3d/humanoid_main_opt.glb"
)

# We want everything < 200KB. We will aggressively simplify.
for file in "${MODELS[@]}"; do
  echo "Aggressively optimizing $file"
  # Use simplify directly on the current file, which might already be somewhat small,
  # but humanoid is 18MB, so we should simplify to 0.01 ratio.
  npx -y @gltf-transform/cli@latest simplify "$file" temp_s.glb --ratio 0.01 --error 0.1
  
  # Compress textures to small webp
  npx -y @gltf-transform/cli@latest optimize temp_s.glb temp_o.glb --texture-size 128 --texture-compress webp
  
  # Compress with Draco
  npx -y @gltf-transform/cli@latest draco temp_o.glb temp_d.glb --method edgebreaker --quantize-position 10
  
  if [ -f temp_d.glb ]; then
    mv temp_d.glb "$file"
    rm -f temp_s.glb temp_o.glb
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "$file is now $size"
  else
    echo "Failed on $file"
  fi
done
