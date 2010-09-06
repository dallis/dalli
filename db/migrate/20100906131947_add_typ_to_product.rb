class AddTypToProduct < ActiveRecord::Migration
  def self.up
    add_column :products, :typ, :boolean
  end

  def self.down
    remove_column :products, :typ
  end
end
